const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

describe('models.location', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['location']);
  });

  it('create a new location record', async () => {
    let Location = models.Location.build({
      Name: 'Ben',
      Address: '360 Valencia',
    });
    assert.deepStrictEqual(Location.id, null);
    await Location.save(); //save to data base, id will generate after it save
    assert(Location.id);

    assert.deepStrictEqual(Location.Name, 'Ben');
    assert.deepStrictEqual(Location.Address, '360 Valencia');
  });
  it('fetches all the time', async () => {
    const results = await models.Location.findAll();
    assert.deepStrictEqual(results.length, 2);
    console.log(results);
  });
});
