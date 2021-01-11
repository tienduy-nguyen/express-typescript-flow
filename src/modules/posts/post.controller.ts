import express from 'express';
import { container, injectable } from 'tsyringe';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';
import { Request, Response } from 'express';

@injectable()
export class PostController {
  public path = '/posts';
  public router = express.Router();

  constructor(private postService: PostService) {
    this.postService = container.resolve(PostService);
    this.initializeRoutes();
  }

  /* Private methods */
  private initializeRoutes() {
    this.router.get(this.path, this.getPosts);
    this.router.get(this.path, this.getPostById);
    this.router.post(this.path, this.createPost);
    this.router.put(this.path, this.updatePost);
    this.router.delete(this.path, this.deletePost);
  }

  /* Private methods of routes */
  private getPosts = (req: Request, res: Response) => {
    res.send(this.postService.getPosts());
  };
  private getPostById = (req: Request, res: Response) => {
    res.send(this.postService.getPostById(req.params.id));
  };

  private createPost = (req: Request, res: Response) => {
    const post: CreatePostDto = req.body;
    this.postService.createPost(post);
    res.send(post);
  };
  private updatePost = (req: Request, res: Response) => {
    const postDto: UpdatePostDto = req.body;
    res.send(this.postService.updatePost(req.params.id, postDto));
  };
  private deletePost = (req: Request, res: Response) => {
    res.send(this.postService.deletePost(req.params.id));
  };
}
