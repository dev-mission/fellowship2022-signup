const crypto = require('crypto');
const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

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
    order: [['TimeIn', 'ASC']],
  };
  const { locationId, programId } = req.query;
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
  }
  const { records, pages, total } = await models.Visit.paginate(options);
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
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
