const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

describe('models.programlocation', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['program', 'location', 'programlocation']);
  });

  it('create a new program location record', async () => {
    let ProgramLocation = models.ProgramLocation.build({
      LocationId: 1,
      ProgramId: 1,
    });
    assert.deepStrictEqual(ProgramLocation.id, null);
    await ProgramLocation.save(); //save to data base, id will generate after it save
    assert(ProgramLocation.id);

    assert.deepStrictEqual(ProgramLocation.LocationId, 1);
    assert.deepStrictEqual(ProgramLocation.ProgramId, 1);
  });
  it('fetches all the time', async () => {
    const results = await models.ProgramLocation.findAll();
    assert.deepStrictEqual(results.length, 1);
  });
});
