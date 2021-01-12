import { PostRepository, IPostRepository } from '@modules/posts/repositories';
import { container } from 'tsyringe';

/* Dependency injection: Register  container as singleton, using in whole app */
container.registerSingleton<IPostRepository>('PostRepository', PostRepository);
