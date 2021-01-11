import express, { Application } from 'express';
import { createServer } from './app';

async function bootstrap() {
  const app: Application = express();
  await createServer(app);

  app.listen(1776, () =>
    console.log('Server running at http://localhost:1776/'),
  );
}
bootstrap();
