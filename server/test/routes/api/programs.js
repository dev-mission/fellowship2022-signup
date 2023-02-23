const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/programs', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['programs', 'users']);
    testSession = session(app);
  });

  describe('GET /', () => {
    it('returns a list of Programs', async () => {
      const response = await testSession.get('/api/programs').expect(HttpStatus.OK);
      const program = response.body;
      assert.deepStrictEqual(program.length, 2);
    });
  });

  context('authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);
    });

    describe('GET /:id', () => {
      it('returns one Program by id', async () => {
        const response = await testSession.get('/api/programs/1').expect(HttpStatus.OK);
        const program = response.body; // all data coming back from server
        assert.deepStrictEqual(program.Name, 'Pre-Apprenticeship Bootcamp');
      });

      it('returns NOT FOUND for an id not in the database', async () => {
        await testSession.get('/api/programs/0').expect(HttpStatus.NOT_FOUND);
      });
    });

    describe('POST /', () => {
      it('creates a new Program', async () => {
        const response = await testSession // testing sending to the server
          .post('/api/programs')
          .set('Accept', 'application/json')
          .send({
            Name: 'Jose',
          })
          .expect(HttpStatus.CREATED);

        const { id, Name } = response.body; // checking response of service is correct
        assert(id);
        assert.deepStrictEqual(Name, 'Jose');

        const program = await models.Program.findByPk(id); // checking if it is found on data base
        assert(program);
        assert.deepStrictEqual(program.Name, 'Jose');
      });
    });

    describe('PATCH /:id', () => {
      it('updates an existing Program', async () => {
        const response = await testSession
          .patch('/api/programs/1')
          .set('Accept', 'application/json')
          .send({
            Name: 'Jose',
          })
          .expect(HttpStatus.OK);

        const { id, Name } = response.body;
        assert.deepStrictEqual(id, 1);
        assert.deepStrictEqual(Name, 'Jose');

        const program = await models.Program.findByPk(id);
        assert(program);
        assert.deepStrictEqual(program.Name, 'Jose');
      });
    });

    describe('DELETE /:id', () => {
      it('deletes an existing Program', async () => {
        await testSession.delete('/api/programs/1').expect(HttpStatus.OK);
        const program = await models.Program.findByPk(1);
        assert.deepStrictEqual(program, null);
      });
    });
  });
});
