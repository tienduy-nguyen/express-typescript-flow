import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { ormConfig } from '@common/config/ormConfig';
import { createConnection } from 'typeorm';
import { App } from './app/app';
import { container } from 'tsyringe';

dotenv.config();

async function bootstrap() {
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
  const app = container.resolve(App);
  app.useGlobalPrefix('api');
  const port = Number(process.env.SERVER_PORT);
  app.listen(port);
}
bootstrap();
