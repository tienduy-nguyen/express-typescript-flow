import { container } from 'tsyringe';
import { App } from '../src/app/app';
import { Application } from 'express';
import * as request from 'supertest';

describe('App controller (e2e)', async () => {
  let appExpress: Application;

  beforeEach(async () => {
    const appProject = container.resolve(App);
    await appProject.bootstrapServerExpress();
    appExpress = appProject.app;
  });

  it('/ (GET)', () => {
    return request(appExpress).get('/').expect(200).expect('Hi there!');
  });
});
