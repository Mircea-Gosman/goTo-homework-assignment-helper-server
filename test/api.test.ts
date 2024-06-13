import request from 'supertest';

import app from '../src/app';
import { connectToDatabase, mongoClient } from '../src/database';

describe('GET /api/task/user', () => {
  beforeAll(() => {
    connectToDatabase()
  });

  afterAll((done) => {
    mongoClient.close().then(()=> done())
  });
});

describe('POST /api/task/', () => {
  beforeAll(() => {
    connectToDatabase()
  });

  afterAll((done) => {
    mongoClient.close().then(()=> done())
  });
});

describe('PATCH /api/task/', () => {
  beforeAll(() => {
    connectToDatabase()
  });

  afterAll((done) => {
    mongoClient.close().then(()=> done())
  });
});

describe('DELETE /api/task/', () => {
  beforeAll(() => {
    connectToDatabase()
  });

  afterAll((done) => {
    mongoClient.close().then(()=> done())
  });
});