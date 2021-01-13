import { NotFoundException } from 'src/common/exceptions';
import { inject, injectable } from 'tsyringe';
import { CreatePostDto, UpdatePostDto } from './dto';
import { IPostRepository } from './repository/post.repository.interface';

@injectable()
export class PostService {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}
  public async getPosts() {
    const posts = await this.postRepository.getPosts();
    return posts;
  }
  public async getPostById(id: string) {
    const post = await this.postRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
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
