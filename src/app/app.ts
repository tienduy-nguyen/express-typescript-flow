import express, { Application } from 'express';
import cors from 'cors';
import { IController } from '@common/interfaces/controller.interface';
import { container, injectable } from 'tsyringe';
import { errorMiddleware } from '@common/middleware';
import helmet from 'helmet';
import './app.provider';
import { AppController } from './app.controller';
import * as cookieParser from 'cookie-parser';

@injectable()
export class App {
  private controllers = [] as IController[];
  private port = 5000; // Default port
  private app: Application;
  private globalPrefix: string;

  constructor() {
    this.app = express();
  }

  /* Public methods */
  public get getServer() {
    return this.app;
  }
  public listen(port: number, log = true) {
    this.port = port;
    this.bootstrapServerExpress();
    this.app.listen(this.port, () => {
      if (log) {
        console.log(`Server is running at http://localhost:${this.port}/`);
      }
    });
  }
  public useGlobalPrefix(prefix: string) {
    this.globalPrefix = '/' + prefix;
  }

  /* Bootstrap server */
  private bootstrapServerExpress() {
    this.initMiddleware();
    this.initControllers();
    this.initErrorHandling();
  }

  private initMiddleware() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(cookieParser());
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
      this.app.use(this.globalPrefix, c.router);
    });
  }
}
