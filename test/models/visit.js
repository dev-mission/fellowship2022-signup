const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

describe('models.visit', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['visits']);
  });

  it('create a new program record', async () => {
    let Visit = models.Visit.build({
      FirstName: '',
      LastName: '',
      PhoneNumber: '',
      Temperature: '',
      ProgramId: '',
      LocationId: '',
      TimeIn: '',
      TimeOut: ''
    });
    assert.deepStrictEqual(Visit.id, null);
    await Visit.save(); //save to data base, id will generate after it save
    assert(Visit.id);

    assert.deepStrictEqual(Visit.Name, '');
  });
  it('fetches all the time', async () => {
    const results = await models.Visit.findAll();
    assert.deepStrictEqual(results.length, 2);
    console.log(results);
  });
});