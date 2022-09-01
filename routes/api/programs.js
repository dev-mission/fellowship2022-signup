const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

// http methods
router.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const { records, pages, total } = await models.Program.paginate({
    page,
    include: models.Location,
    order: [
      ['Name', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', interceptors.requireAdmin, async (req, res) => {
  const record = await models.Program.findByPk(req.params.id, {
    include: models.Location,
  });
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Program.create(_.pick(req.body, ['Name']));
      await record.setLocations(req.body.LocationIds ?? [], { transaction });
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
      record = await models.Program.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['Name']), { transaction }); // doing mutiple things on data base, and prevent something happen in the same time
        await record.setLocations(req.body.LocationIds ?? [], { transaction });
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
      record = await models.Program.findByPk(req.params.id, { transaction });
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
