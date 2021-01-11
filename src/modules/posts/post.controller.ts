import express from 'express';
import { container, injectable } from 'tsyringe';
import { CreatePostDto } from './dto';
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
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createAPost);
  }

  private getAllPosts = (req: Request, res: Response) => {
    res.send(this.postService.getPosts());
  };

  private createAPost = (req: Request, res: Response) => {
    const post: CreatePostDto = req.body;
    this.postService.createPost(post);
    res.send(post);
  };
}
