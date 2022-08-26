const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

describe('models.visit', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['program', 'location', 'visits']);
  });

  it('create a new visit record', async () => {
    let Visit = models.Visit.build({
      FirstName: 'Kimon',
      LastName: 'Monokandilos',
      PhoneNumber: '4155276516',
      Temperature: '97',
      ProgramId: 1,
      LocationId: 1,
      TimeIn: '2022-08-15T02:07:23+0000',
      TimeOut: '2022-08-15T02:07:24+0000',
    });
    assert.deepStrictEqual(Visit.id, null);
    await Visit.save(); //save to data base, id will generate after it save
    assert(Visit.id);

    assert.deepStrictEqual(Visit.FirstName, 'Kimon');
    assert.deepStrictEqual(Visit.LastName, 'Monokandilos');
    assert.deepStrictEqual(Visit.PhoneNumber, '4155276516');
    assert.deepStrictEqual(Visit.Temperature, '97');
    assert.deepStrictEqual(Visit.ProgramId, 1);
    assert.deepStrictEqual(Visit.LocationId, 1);
    assert.deepStrictEqual(Visit.TimeIn, new Date('2022-08-15T02:07:23+0000'));
    assert.deepStrictEqual(Visit.TimeOut, new Date('2022-08-15T02:07:24+0000'));
  });
  it('fetches all the time', async () => {
    const results = await models.Visit.findAll();
    assert.deepStrictEqual(results.length, 1);
  });
});
