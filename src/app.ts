import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { IController } from './common/interfaces/controller.interface';
import { PostController } from './modules/posts/post.controller';
import { container } from 'tsyringe';
import { createConnection } from 'typeorm';
import { errorMiddleware } from '@common/middleware';
import { AuthController } from '@modules/auth/auth.controller';
import { ormConfig } from '@common/config/ormConfig';

export class App {
  public app: Application;
  public controllers = [] as IController[];
  public port = 5000; // Default port

  constructor() {
    this.app = express();
    this.initConfig();
  }

  /* Public methods */
  public async bootstrapServerExpress() {
    await this.connectionDb();
    this.initMiddleware();
    this.initControllers();

    this.initErrorHandling();

    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}/`);
    });
  }

  /* Private methods */
  private initConfig() {
    dotenv.config();
    this.port = Number(process.env.SERVER_PORT); // Get port from .env file
  }
  private initMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }
  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initControllers() {
    this.getAllControllers();
    this.app.get('/', (req, res) => {
      res.send('Hi there!');
    });

    this.controllers.forEach(c => {
      this.app.use(process.env.ROUTE_GLOBAL_PREFIX, c.router);
    });
  }
  private getAllControllers() {
    const postController = container.resolve(PostController);
    const authController = container.resolve(AuthController);
    this.controllers.push(postController);
    this.controllers.push(authController);
  }

  private async connectionDb() {
    const connection = await createConnection(ormConfig());
    console.log('Database connected!');
    return connection;
  }
}
