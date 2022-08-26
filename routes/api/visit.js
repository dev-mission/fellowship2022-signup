const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

//http methods
router.get('/', async (req, res) => {
  const records = await models.Visit.findAll();
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  const record = await models.Visit.findByPk(req.params.id);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.post('/', async (req, res) => {
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

router.patch('/:id/sign-out', async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Visit.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update({ TimeOut: new Date() }, { transaction }); //doing mutiple things on data base, and prevent something happen in the same time
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

router.patch('/:id', async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Visit.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['FirstName', 'LastName', 'PhoneNumber', 'Temperature']), { transaction }); //doing mutiple things on data base, and prevent something happen in the same time
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
