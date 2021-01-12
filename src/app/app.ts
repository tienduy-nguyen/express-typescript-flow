import express, { Application } from 'express';
import cors from 'cors';
import { IController } from '@common/interfaces/controller.interface';
import { container, injectable } from 'tsyringe';
import { errorMiddleware } from '@common/middleware';
import helmet from 'helmet';
import './app.provider';
import { AppController } from './app.controller';

@injectable()
export class App {
  private controllers = [] as IController[];
  private port = 5000; // Default port
  private app: Application;

  constructor() {
    this.app = express();
    this.bootstrapServerExpress();
  }

  /* Public methods */
  public get getServer() {
    return this.app;
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}/`);
    });
  }

  /* Bootstrap server */
  private async bootstrapServerExpress() {
    this.port = Number(process.env.SERVER_PORT);
    this.initMiddleware();
    this.initControllers();
    this.initErrorHandling();
  }

  private initMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
  }
  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initControllers() {
    this.app.get('/', (req, res) => {
      res.send('Hi there!');
    });

    // Get all controller registered from app controller
    const appControllers = container.resolve(AppController);
    this.controllers = appControllers.all;

    this.controllers.forEach(c => {
      this.app.use(process.env.ROUTE_GLOBAL_PREFIX, c.router);
    });
  }
}
