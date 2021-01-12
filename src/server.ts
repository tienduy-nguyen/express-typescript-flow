import 'reflect-metadata';
import { App } from './app/app';

async function bootstrap() {
  const app = new App();
  await app.bootstrapServerExpress();
}
bootstrap();
