import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { ormConfig } from '@common/config/ormConfig';
import { createConnection } from 'typeorm';
import { App } from './app/app';
import { container } from 'tsyringe';

async function bootstrap() {
  // Set global .env config
  dotenv.config();

  // Connect database
  try {
    createConnection(ormConfig()).then(connection => {
      console.log('Database connected!');
      // Bootstrap server
      const app = container.resolve(App);
      app.useGlobalPrefix('api');
      const port = Number(process.env.SERVER_PORT);
      app.listen(port);
      return connection;
    });
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
}
bootstrap();
