const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/locations', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['locations', 'users']);
    testSession = session(app);
  });

  describe('GET /:id', () => {
    it('returns one Location by id', async () => {
      const response = await testSession.get('/api/locations/1').expect(HttpStatus.OK);
      const location = response.body; // all data coming back from server
      assert.deepStrictEqual(location.Name, 'Jose');
    });

    it('returns NOT FOUND for an id not in the database', async () => {
      await testSession.get('/api/locations/0').expect(HttpStatus.NOT_FOUND);
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

    describe('GET /', () => {
      it('returns a list of Locations', async () => {
        const response = await testSession.get('/api/locations').expect(HttpStatus.OK);
        const location = response.body;
        assert.deepStrictEqual(location.length, 2);
      });
    });

    describe('POST /', () => {
      it('creates a new Location', async () => {
        const response = await testSession // testing sending to the server
          .post('/api/locations')
          .set('Accept', 'application/json')
          .send({
            Name: 'Jose',
            Address: '360 Valencia',
          })
          .expect(HttpStatus.CREATED);

        const { id, Name, Address } = response.body; // checking response of service is correct
        assert(id);
        assert.deepStrictEqual(Name, 'Jose');
        assert.deepStrictEqual(Address, '360 Valencia');

        const location = await models.Location.findByPk(id); // checking if it is found on data base
        assert(location);
        assert.deepStrictEqual(location.Name, 'Jose');
        assert.deepStrictEqual(location.Address, '360 Valencia');
      });
    });

    describe('GET /:id/setup', () => {
      it('returns an authentication token and logs out the admin user', async () => {
        const response = await testSession.get('/api/locations/1/setup').expect(HttpStatus.OK);
        assert(response.headers['set-cookie'].find((cookie) => cookie.startsWith('sheet-token=')));
        await testSession.get('/api/locations/1/setup').expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('PATCH /:id', () => {
      it('updates an existing Location', async () => {
        const response = await testSession
          .patch('/api/locations/1')
          .set('Accept', 'application/json')
          .send({
            Name: 'Jose',
            Address: '360 Valencia',
          })
          .expect(HttpStatus.OK);

        const { id, Name, Address } = response.body;
        assert.deepStrictEqual(id, 1);
        assert.deepStrictEqual(Name, 'Jose');
        assert.deepStrictEqual(Address, '360 Valencia');

        const location = await models.Location.findByPk(id);
        assert(location);
        assert.deepStrictEqual(location.Name, 'Jose');
        assert.deepStrictEqual(location.Address, '360 Valencia');
      });
    });

    describe('DELETE /:id', () => {
      it('deletes an existing Location', async () => {
        await testSession.delete('/api/locations/1').expect(HttpStatus.OK);
        const location = await models.Location.findByPk(1);
        assert.deepStrictEqual(location, null);
      });
    });
  });
});
