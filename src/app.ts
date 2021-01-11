import { Application } from 'express';

export async function createServer(app: Application) {
  app.get('/', (req, res) => {
    res.send('Hi there!');
  });
}
