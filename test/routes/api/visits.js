const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/visits', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['programs', 'locations', 'visits', 'users']);
    testSession = session(app);
  });

  describe('GET /', () => {
    it('returns a list of Visits', async () => {
      const response = await testSession.get('/api/visits').expect(HttpStatus.OK);
      const visit = response.body;
      assert.deepStrictEqual(visit.length, 1);
    });
  });

  describe('GET /:id', () => {
    it('returns one Visit by id', async () => {
      const response = await testSession.get('/api/visits/1').expect(HttpStatus.OK);
      const visit = response.body; // all data coming back from server
      assert.deepStrictEqual(visit.FirstName, 'Kimon');
      assert.deepStrictEqual(visit.LastName, 'Monokandilos');
      assert.deepStrictEqual(visit.PhoneNumber, '4155276516');
      assert.deepStrictEqual(visit.Temperature, '97');
      assert.deepStrictEqual(visit.ProgramId, 1);
      assert.deepStrictEqual(visit.LocationId, 1);
      assert.deepStrictEqual(visit.TimeIn, '2022-08-15T02:07:23.000Z');
      assert.deepStrictEqual(visit.TimeOut, null);
    });

    it('returns NOT FOUND for an id not in the database', async () => {
      await testSession.get('/api/visit/0').expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /', () => {
    it('creates a new visit', async () => {
      const response = await testSession // testing sending to the server
        .post('/api/visits')
        .set('Accept', 'application/json')
        .send({
          FirstName: 'Kimon',
          LastName: 'Monokandilos',
          PhoneNumber: '4155276516',
          Temperature: '97',
          ProgramId: 1,
          LocationId: 1,
        })
        .expect(HttpStatus.CREATED);

      const { id, FirstName, LastName, PhoneNumber, Temperature, ProgramId, LocationId, TimeIn, TimeOut } = response.body; // checking response of service is correct
      assert(id);
      assert.deepStrictEqual(FirstName, 'Kimon');
      assert.deepStrictEqual(LastName, 'Monokandilos');
      assert.deepStrictEqual(PhoneNumber, '4155276516');
      assert.deepStrictEqual(Temperature, '97');
      assert.deepStrictEqual(ProgramId, 1);
      assert.deepStrictEqual(LocationId, 1);
      assert(TimeIn);
      assert.deepStrictEqual(TimeOut, null);

      const visit = await models.Visit.findByPk(id); // checking if it is found on data base
      assert(visit);
      assert.deepStrictEqual(visit.FirstName, 'Kimon');
      assert.deepStrictEqual(visit.LastName, 'Monokandilos');
      assert.deepStrictEqual(visit.PhoneNumber, '4155276516');
      assert.deepStrictEqual(visit.Temperature, '97');
      assert.deepStrictEqual(visit.ProgramId, 1);
      assert.deepStrictEqual(visit.LocationId, 1);
      assert.deepStrictEqual(visit.TimeIn, new Date(TimeIn));
      assert.deepStrictEqual(visit.TimeOut, null);
    });
  });

  describe('PATCH /:id/sign-out', () => {
    it('sets the TimeOut on an existing visit', async () => {
      const response = await testSession.patch('/api/visits/1/sign-out').set('Accept', 'application/json').expect(HttpStatus.OK);

      const { id, TimeOut } = response.body;
      assert.deepStrictEqual(id, 1);
      assert(TimeOut);

      const visit = await models.Visit.findByPk(id);
      assert(visit);
      assert.deepStrictEqual(visit.TimeOut, new Date(TimeOut));
    });
  });

  describe('PATCH /:id', () => {
    it('updates an existing visit', async () => {
      const response = await testSession
        .patch('/api/visits/1')
        .set('Accept', 'application/json')
        .send({
          FirstName: 'New',
          LastName: 'User',
          PhoneNumber: '4155551234',
          Temperature: '98.6',
        })
        .expect(HttpStatus.OK);

      const { id, FirstName, LastName, PhoneNumber, Temperature } = response.body;
      assert.deepStrictEqual(id, 1);
      assert.deepStrictEqual(FirstName, 'New');
      assert.deepStrictEqual(LastName, 'User');
      assert.deepStrictEqual(PhoneNumber, '4155551234');
      assert.deepStrictEqual(Temperature, '98.6');

      const visit = await models.Visit.findByPk(id);
      assert(visit);
      assert.deepStrictEqual(visit.FirstName, 'New');
      assert.deepStrictEqual(visit.LastName, 'User');
      assert.deepStrictEqual(visit.PhoneNumber, '4155551234');
      assert.deepStrictEqual(visit.Temperature, '98.6');
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

    describe('DELETE /:id', () => {
      it('deletes an existing visit', async () => {
        await testSession.delete('/api/visits/1').expect(HttpStatus.OK);
        const visit = await models.Visit.findByPk(1);
        assert.deepStrictEqual(visit, null);
      });
    });
  });
});
