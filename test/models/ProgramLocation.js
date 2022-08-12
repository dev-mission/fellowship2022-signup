const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

describe('models.ProgramLocation', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['programlocations']);
  });

  it('create a new ProgramLocation record', async () => {
    let ProgramLocation = models.ProgramLocation.build({
      LocationId: '360 Valencia',
      ProgramId: 'Pre-Apprenticeship',
    });
    assert.deepStrictEqual(ProgramLocation.id, null);
    await ProgramLocation.save(); //save to data base, id will generate after it save
    assert(ProgramLocation.id);

    assert.deepStrictEqual(ProgramLocation.LocationId, '360 Valencia');
    assert.deepStrictEqual(ProgramLocation.ProgramId, 'Pre-Apprenticeship');
  });
  it('fetches all the time', async () => {
    const results = await models.ProgramLocation.findAll();
    assert.deepStrictEqual(results.length, 2);
    console.log(results);
  });
});
