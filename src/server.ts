import 'reflect-metadata';
import { App } from './main/app';

async function bootstrap() {
  const app = new App();
  await app.bootstrapServerExpress();
}
bootstrap();
