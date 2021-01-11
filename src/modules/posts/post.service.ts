import { injectable } from 'tsyringe';
import { CreatePostDto } from './dto';
import { Post } from './post.interface';

@injectable()
export class PostService {
  public getPosts() {
    return this.posts;
  }
  public createPost(postDto: CreatePostDto) {
    this.posts.push(postDto);
  }

  private posts: Post[] = [
    {
      author: 'Marcin',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum',
    },
  ];
}
