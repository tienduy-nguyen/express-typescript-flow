import { CreatePostDto, UpdatePostDto } from '../dto';
import { Post } from '../post.entity';

export interface IPostRepository {
  getPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(postDto: CreatePostDto): Promise<Post | undefined>;
  updatePost(post: Post, postDto: UpdatePostDto): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;
}
