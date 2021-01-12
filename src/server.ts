import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { ormConfig } from '@common/config/ormConfig';
import { createConnection } from 'typeorm';
import { App } from './app/app';

async function bootstrap() {
  // Set global .env config
  dotenv.config();

  // Connect database
  try {
    const connection = await createConnection(ormConfig());
    await connection.runMigrations();
    console.log('Database connected!');
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }

  // Bootstrap server
  const app = new App();
  app.listen();
}
bootstrap();
