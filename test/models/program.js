const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

describe('models.program', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['program']);
  });

  it('create a new program record', async () => {
    let Program = models.Program.build({
      Name: 'Ben',
    });
    assert.deepStrictEqual(Program.id, null);
    await Program.save(); //save to data base, id will generate after it save
    assert(Program.id);

    assert.deepStrictEqual(Program.Name, 'Ben');
  });
  it('fetches all the time', async () => {
    const results = await models.Program.findAll();
    assert.deepStrictEqual(results.length, 2);
  });
});
