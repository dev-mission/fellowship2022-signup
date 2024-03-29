const crypto = require('crypto');
const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

// http methods
router.get('/', interceptors.requireLogin, async (req, res) => {
  const page = req.query.page || 1;
  const { records, pages, total } = await models.Location.paginate({
    page,
    include: models.Program,
    order: [
      [models.Program, 'Name', 'Asc'],
      ['Name', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id/setup', interceptors.requireLogin, async (req, res) => {
  const record = await models.Location.findByPk(req.params.id);
  if (record) {
    req.logout(() => {
      const nonce = crypto.randomBytes(8).toString('hex');
      const hash = crypto.createHash('sha256', process.env.SESSION_SECRET).update(`${record.id}`).update(nonce).digest('hex');
      res.cookie('sheet-id', `${record.id}`, { maxAge: 31556952000 /* 1 yr in ms */ });
      res.cookie('sheet-token', `${record.id}.${nonce}.${hash}`, { signed: true, maxAge: 31556952000 /* 1 yr in ms */ });
      res.status(HttpStatus.OK).end();
    });
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.get('/:id', async (req, res) => {
  const record = await models.Location.findByPk(req.params.id, {
    include: [{ model: models.ProgramLocation, include: models.Program }],
    order: [[models.ProgramLocation, 'position', 'ASC']],
  });
  if (record) {
    const json = record.toJSON();
    json.Programs = json.ProgramLocations.map((pl) => pl.Program);
    delete json.ProgramLocations;
    res.json(json);
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Location.create(_.pick(req.body, ['Name', 'Address']), { transaction });
      await record.setPrograms(req.body.ProgramIds ?? [], { transaction });
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

router.patch('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Location.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['Name', 'Address']), { transaction }); // doing mutiple things on data base, and prevent something happen in the same time
        const programIds = req.body.ProgramIds ?? [];
        await record.setPrograms(programIds, { transaction });
        const joins = await record.getProgramLocations({ transaction });
        joins.forEach((join) => {
          join.position = programIds.indexOf(join.ProgramId) + 1;
        });
        await Promise.all(joins.map((j) => j.save({ transaction })));
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
      record = await models.Location.findByPk(req.params.id, { transaction });
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
