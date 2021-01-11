import express, { NextFunction } from 'express';
import { container, injectable } from 'tsyringe';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';
import { Request, Response } from 'express';

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
    this.router.get(this.path, this.getPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, this.createPost);
    this.router.put(`${this.path}/:id`, this.updatePost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
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
  private updatePost = (req: Request, res: Response, next: NextFunction) => {
    try {
      const postDto: UpdatePostDto = req.body;
      res.json(this.postService.updatePost(req.params.id, postDto));
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
