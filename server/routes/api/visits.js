const crypto = require('crypto');
const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const Sequelize = require('sequelize');
const QueryStream = require('pg-query-stream');
const { transform } = require('stream-transform');
const { DateTime } = require('luxon');
const { stringify } = require('csv-stringify');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

async function requireToken(req, res, next) {
  if (req.user?.isAdmin) {
    next();
  } else {
    req.token = req.signedCookies['sheet-token'];
    if (!req.token) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else {
      const parts = req.token.split('.');
      const hash = crypto.createHash('sha256', process.env.SESSION_SECRET).update(parts[0]).update(parts[1]).digest('hex');
      if (hash !== parts[2]) {
        res.status(HttpStatus.UNAUTHORIZED).end();
      } else {
        next();
      }
    }
  }
}

// http methods
router.get('/', requireToken, async (req, res) => {
  const page = req.query.page || 1;
  const options = {
    where: {},
    page,
  };
  const { from, to, locationId, programId, timeZone, format } = req.query;
  if (from || to) {
    let arg;
    if (timeZone) {
      arg = Sequelize.literal(`"TimeIn" AT TIME ZONE ${models.sequelize.escape(timeZone)}`);
    } else {
      arg = Sequelize.col('TimeIn');
    }
    if (from) {
      options.where.from = Sequelize.where(Sequelize.fn('DATE', arg), '>=', from);
    }
    if (to) {
      options.where.to = Sequelize.where(Sequelize.fn('DATE', arg), '<=', to);
    }
  }
  if (locationId) {
    options.where.LocationId = locationId;
    if (req.token) {
      const parts = req.token.split('.');
      if (locationId !== parts[0]) {
        res.status(HttpStatus.UNAUTHORIZED).end();
        return;
      }
    }
  }
  if (programId) {
    options.where.ProgramId = programId;
  }
  if (!req.user) {
    options.where.TimeOut = null;
    options.order = [['TimeIn', 'ASC']];
  } else {
    options.include = [models.Location, models.Program];
    options.order = [['TimeIn', 'DESC']];
  }
  if (format === 'csv') {
    // eslint-disable-next-line no-underscore-dangle
    models.Visit._conformIncludes(options);
    // eslint-disable-next-line no-underscore-dangle
    models.Visit._expandIncludeAll(options);
    // eslint-disable-next-line no-underscore-dangle
    models.Visit._validateIncludedElements(options);
    const query = models.sequelize.dialect.queryGenerator.selectQuery(models.Visit.tableName, options, models.Visit);
    const queryStream = new QueryStream(query);
    const connection = await models.sequelize.connectionManager.getConnection();
    const stream = connection.query(queryStream);
    stream.on('end', () => models.sequelize.connectionManager.releaseConnection(connection));
    stream.on('finish', () => models.sequelize.connectionManager.releaseConnection(connection));
    const transformer = transform((data) => {
      let timeIn = DateTime.fromJSDate(data.TimeIn);
      if (timeZone) {
        timeIn = timeIn.setZone(timeZone);
      }
      return {
        Date: timeIn.toISODate(),
        Location: data['Location.Name'],
        Program: data['Program.Name'],
        Name: `${data.FirstName} ${data.LastName}`,
        PhoneNumber: `${data.PhoneNumber.substring(0, 3)}-${data.PhoneNumber.substring(3, 6)}-${data.PhoneNumber.substring(6)}`,
        Temperature: data.Temperature,
        TimeIn: timeIn.toLocaleString(DateTime.TIME_SIMPLE),
        TimeOut: data.TimeOut ? DateTime.fromJSDate(data.TimeOut).toLocaleString(DateTime.TIME_SIMPLE) : '',
      };
    });
    const csv = stringify({ header: true });
    res.attachment('report.csv');
    stream.pipe(transformer).pipe(csv).pipe(res);
  } else {
    const { records, pages, total } = await models.Visit.paginate(options);
    helpers.setPaginationHeaders(req, res, page, pages, total);
    res.json(records.map((r) => r.toJSON()));
  }
});

router.get('/search', requireToken, async (req, res) => {
  const { phoneNumber: PhoneNumber } = req.query;
  if (PhoneNumber?.match(/^\d{10}$/)) {
    // find the most recent visit by this PhoneNumber
    const options = {
      where: { PhoneNumber },
      order: [['createdAt', 'DESC']],
      limit: 1,
    };
    const visit = await models.Visit.findOne(options);
    if (visit) {
      const { FirstName, LastName } = visit;
      res.json({ FirstName, LastName });
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } else {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
  }
});

router.get('/:id', requireToken, async (req, res) => {
  const record = await models.Visit.findByPk(req.params.id);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.post('/', requireToken, async (req, res) => {
  if (req.token) {
    const parts = req.token.split('.');
    if (`${req.body.LocationId}` !== parts[0]) {
      res.status(HttpStatus.UNAUTHORIZED).end();
      return;
    }
  }
  try {
    const record = await models.Visit.create({
      ..._.pick(req.body, ['FirstName', 'LastName', 'PhoneNumber', 'Temperature', 'ProgramId', 'LocationId']),
      TimeIn: new Date(),
    });
    res.status(HttpStatus.CREATED).json(record.toJSON());
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.patch('/:id/sign-out', requireToken, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Visit.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update({ TimeOut: new Date() }, { transaction }); // doing mutiple things on data base, and prevent something happen in the same time
      }
    });
    if (record) {
      res.json(record.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.patch('/:id', requireToken, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Visit.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['FirstName', 'LastName', 'PhoneNumber', 'Temperature']), { transaction }); // doing mutiple things on data base, and prevent something happen in the same time
      }
    });
    if (record) {
      res.json(record.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.delete('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Visit.findByPk(req.params.id, { transaction });
      if (record) {
        await record.destroy({ transaction });
      }
    });
    if (record) {
      res.status(HttpStatus.OK).end();
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
});

module.exports = router;
