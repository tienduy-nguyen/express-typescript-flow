import { PostRepository, IPostRepository } from '@modules/posts/repositories';
import { container } from 'tsyringe';

container.registerSingleton<IPostRepository>('PostRepository', PostRepository);
