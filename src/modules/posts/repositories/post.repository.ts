import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { Post } from '../post.entity';
import { IPostRepository } from './post.repository.interface';

@injectable()
export class PostRepository implements IPostRepository {
  private ormRepository: Repository<Post>;
  constructor() {
    this.ormRepository = getRepository(Post);
  }
  public async getPosts(): Promise<Post[]> {
    return await this.ormRepository.find();
  }
  public async getPostById(id: string): Promise<Post> {
    return await this.ormRepository.findOne({
      where: { id: Number(id) },
    });
  }
  public async createPost(postDto: CreatePostDto): Promise<Post> {
    const post = await this.ormRepository.create(postDto);
    await this.ormRepository.save(post);
    return post;
  }

  public async updatePost(post: Post, postDto: UpdatePostDto): Promise<Post> {
    const updated = Object.assign(post, postDto);
    await this.ormRepository.save(updated);
    return updated;
  }
  public async deletePost(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
