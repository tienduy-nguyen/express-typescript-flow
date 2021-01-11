import 'reflect-metadata';
import { container } from 'tsyringe';
import { App } from './app';

async function bootstrap() {
  const app = container.resolve(App);
  app.bootstrapServerExpress();
}

bootstrap();
