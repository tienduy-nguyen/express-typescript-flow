import express, { NextFunction } from 'express';
import { container, injectable } from 'tsyringe';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';
import { Request, Response } from 'express';
import handler from 'express-async-handler';
import { validationMiddleware } from '@common/middleware';
import { authMiddleware } from '@common/middleware';

@injectable()
export class PostController {
  public path = '/posts';
  public router = express.Router();
  private postService: PostService;

  constructor() {
    this.postService = container.resolve(PostService);
    this.initializeRoutes();
  }

  /* Private methods */
  private initializeRoutes() {
    this.router.get(this.path, handler(this.getPosts));
    this.router.get(`${this.path}/:id`, handler(this.getPostById));
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post(
        this.path,
        validationMiddleware(CreatePostDto),
        handler(this.createPost),
      )
      .put(
        `${this.path}/:id`,
        validationMiddleware(UpdatePostDto, true),
        handler(this.updatePost),
      )
      .delete(`${this.path}/:id`, handler(this.deletePost));
  }

  /* Private methods of routes */
  private getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.json(await this.postService.getPosts());
    } catch (error) {
      next(error);
    }
  };
  private getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const post = await this.postService.getPostById(req.params.id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

  private createPost = (req: Request, res: Response, next: NextFunction) => {
    try {
      const post: CreatePostDto = req.body;
      this.postService.createPost(post);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };
  private updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const postDto: UpdatePostDto = req.body;
      const post = await this.postService.updatePost(req.params.id, postDto);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };
  private deletePost = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(this.postService.deletePost(req.params.id));
    } catch (error) {
      next(error);
    }
  };
}
