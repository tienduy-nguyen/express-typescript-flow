import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { IController } from './common/interfaces/controller.interface';
import { PostController } from './modules/posts/post.controller';
import { container } from 'tsyringe';
import { createConnection } from 'typeorm';

export class App {
  public app: Application;
  public controllers = [] as IController[];
  public port = 5000;

  constructor() {
    this.app = express();
  }

  /* Public methods */
  public async bootstrapServerExpress() {
    this.initConfig();
    this.initMiddleware();
    this.connectionDB();

    this.initControllers();

    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }

  /* Private methods */
  private initConfig() {
    dotenv.config();
    this.port = Number(process.env.SERVER_PORT);
  }
  private initMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private getAllControllers() {
    const postController = container.resolve(PostController);
    this.controllers.push(postController);
  }
  private initControllers() {
    this.getAllControllers();
    this.app.get('/', (req, res) => {
      res.send('Hi there!');
    });

    this.controllers.forEach(c => {
      this.app.use('/api', c.router);
    });
  }

  private async connectionDB() {
    const connection = await createConnection();
    await connection.synchronize();
  }
}
