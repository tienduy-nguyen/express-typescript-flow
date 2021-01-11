import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { IController } from './common/interfaces/controller.interface';
import { container, injectable } from 'tsyringe';
import { PostController } from './modules/posts/post.controller';

export async function createServer(app: Application) {
  //Get .env variable
  dotenv.config();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hi there!');
  });
}

@injectable()
export class App {
  public app: Application;
  private controllers = [] as IController[];
  private port = 5000;

  constructor() {
    this.app = express();
    const postController = container.resolve(PostController);
    this.controllers.push(postController);
  }

  /* Public methods */
  public bootstrapServerExpress() {
    this.initConfig();
    this.initMiddleware();
    this.initControllers();

    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }

  /* Private methods */
  private initConfig() {
    dotenv.config();
    this.port = Number(process.env.SERVER_PORT);
    console.log('-----------', this.port);
  }
  private initMiddleware() {
    this.app.use(cors);
    this.app.use(express.json());
  }
  private initControllers() {
    this.app.get('/', (req, res) => {
      res.send('Hi there!');
    });
    this.controllers.forEach(c => {
      this.app.use('/api', c.router);
    });
  }
}
