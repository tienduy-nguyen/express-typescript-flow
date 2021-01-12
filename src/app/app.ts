import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { IController } from '@common/interfaces/controller.interface';
import { container, injectable } from 'tsyringe';
import { createConnection } from 'typeorm';
import { errorMiddleware } from '@common/middleware';
import { ormConfig } from '@common/config/ormConfig';
import helmet from 'helmet';
import './app.provider';
import { AppController } from './app.controller';

@injectable()
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

  private async connectionDb() {
    try {
      const connection = await createConnection(ormConfig());
      await connection.runMigrations();
      console.log('Database connected!');
      return connection;
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
  }
}
