const assert = require('assert');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/visit', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['visits', 'users']);
    testSession = session(app);
  });

  describe('GET /', () => {
    it('returns a list of visits', async () => {
      const response = await testSession.get('/api/visit').expect(HttpStatus.OK);
      const visit = response.body;
      assert.deepStrictEqual(visit.length, 2);
    });
  });

  describe('GET /:id', () => {
    it('returns one visit by id', async () => {
      const response = await testSession.get('/api/visit/1').expect(HttpStatus.OK);
      const visit = response.body; // all data coming back from server
      assert.deepStrictEqual(visit.FirstName, 'Kimon');
      assert.deepStrictEqual(visit.LastName, 'Monokandilos');
      assert.deepStrictEqual(visit.PhoneNumber, '4155276516');
      assert.deepStrictEqual(visit.Temperature, '97');
      assert.deepStrictEqual(visit.ProgramId, 1);
      assert.deepStrictEqual(visit.LocationId, 1);
      assert.deepStrictEqual(visit.TimeIn, new Date('2022-08-15T02:07:23+0000'));
      assert.deepStrictEqual(visit.TimeOut, new Date('2022-08-15T02:07:24+0000'));
    });

    it('returns NOT FOUND for an id not in the database', async () => {
      await testSession.get('/api/visit/0').expect(HttpStatus.NOT_FOUND);
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

    describe('POST /', () => {
      it('creates a new visit', async () => {
        const response = await testSession //testing sending to the server
          .post('/api/visit')
          .set('Accept', 'application/json')
          .send({
            FirstName: 'Kimon',
            LastName: 'Monokandilos',
            PhoneNumber: '4155276516',
            Temperature: '97',
            ProgramId: 1,
            LocationId: 1,
            TimeIn: new Date('2022-08-15T02:07:23+0000'),
            TimeOut: new Date('2022-08-15T02:07:24+0000'),
          })
          .expect(HttpStatus.CREATED);

        const { id, FirstName, LastName, PhoneNumber, Temperature, ProgramId, LocationId, TimeIn, TimeOut } = response.body; //checking response of service is correct
        assert(id);
        assert.deepStrictEqual(FirstName, 'Kimon');
        assert.deepStrictEqual(LastName, 'Monokandilos');
        assert.deepStrictEqual(PhoneNumber, '4155276516');
        assert.deepStrictEqual(Temperature, '97');
        assert.deepStrictEqual(ProgramId, 1);
        assert.deepStrictEqual(LocationId, 1);
        assert.deepStrictEqual(TimeIn, new Date('2022-08-15T02:07:23+0000'));
        assert.deepStrictEqual(TimeOut, new Date('2022-08-15T02:07:24+0000'));

        const visit = await models.visit.findByPk(id); //checking if it is found on data base
        assert(visit);
        assert.deepStrictEqual(visit.FirstName, 'Kimon');
        assert.deepStrictEqual(visit.LastName, 'Monokandilos');
        assert.deepStrictEqual(visit.PhoneNumber, '4155276516');
        assert.deepStrictEqual(visit.Temperature, '97');
        assert.deepStrictEqual(visit.ProgramId, 1);
        assert.deepStrictEqual(visit.LocationId, 1);
        assert.deepStrictEqual(visit.TimeIn, new Date('2022-08-15T02:07:23+0000'));
        assert.deepStrictEqual(visit.TimeOut, new Date('2022-08-15T02:07:24+0000'));
      });
    });

    describe('PATCH /:id', () => {
      it('updates an existing visit', async () => {
        const response = await testSession
          .patch('/api/visit/1')
          .set('Accept', 'application/json')
          .send({
            FirstName: 'Kimon',
            LastName: 'Monokandilos',
            PhoneNumber: '4155276516',
            Temperature: '97',
            ProgramId: 1,
            LocationId: 1,
            TimeIn: new Date('2022-08-15T02:07:23+0000'),
            TimeOut: new Date('2022-08-15T02:07:24+0000'),
          })
          .expect(HttpStatus.OK);

        const { id, Name } = response.body;
        assert.deepStrictEqual(id, 1);
        assert.deepStrictEqual(FirstName, 'Kimon');
        assert.deepStrictEqual(LastName, 'Monokandilos');
        assert.deepStrictEqual(PhoneNumber, '4155276516');
        assert.deepStrictEqual(Temperature, '97');
        assert.deepStrictEqual(ProgramId, 1);
        assert.deepStrictEqual(LocationId, 1);
        assert.deepStrictEqual(TimeIn, new Date('2022-08-15T02:07:23+0000'));
        assert.deepStrictEqual(TimeOut, new Date('2022-08-15T02:07:24+0000'));

        const visit = await models.Visit.findByPk(id);
        assert(visit);
        assert.deepStrictEqual(visit.FirstName, 'Kimon');
        assert.deepStrictEqual(visit.LastName, 'Monokandilos');
        assert.deepStrictEqual(visit.PhoneNumber, '4155276516');
        assert.deepStrictEqual(visit.Temperature, '97');
        assert.deepStrictEqual(visit.ProgramId, 1);
        assert.deepStrictEqual(visit.LocationId, 1);
        assert.deepStrictEqual(visit.TimeIn, new Date('2022-08-15T02:07:23+0000'));
        assert.deepStrictEqual(visit.TimeOut, new Date('2022-08-15T02:07:24+0000'));
      });
    });

    describe('DELETE /:id', () => {
      it('deletes an existing visit', async () => {
        await testSession.delete('/api/visit/1').expect(HttpStatus.OK);
        const visit = await models.Visit.findByPk(1);
        assert.deepStrictEqual(visit, null);
      });
    });
  });
});
