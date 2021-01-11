import { NotFoundException } from 'src/common/exceptions';
import { injectable } from 'tsyringe';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostRepository } from './repositories';
import { IPostRepository } from './repositories/post.repository.interface';

@injectable()
export class PostService {
  private postRepository: IPostRepository;
  constructor() {
    this.postRepository = new PostRepository();
  }
  public async getPosts() {
    return await this.postRepository.getPosts();
  }
  public async getPostById(id: string) {
    return await this.postRepository.getPostById(id);
  }
  public async createPost(postDto: CreatePostDto) {
    return await this.postRepository.createPost(postDto);
  }
  public async updatePost(id: string, postDto: UpdatePostDto) {
    const post = await this.postRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return await this.postRepository.updatePost(post, postDto);
  }
  public async deletePost(id: string) {
    await this.postRepository.deletePost(id);
  }
}
