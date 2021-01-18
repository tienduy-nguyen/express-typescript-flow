import {
  CategoryRepository,
  ICategoryRepository,
} from '@modules/category/repository';
import { PostRepository, IPostRepository } from '@modules/posts/repository';
import { container } from 'tsyringe';

/* Dependency injection: Register  container as singleton, using in whole app */
container.registerSingleton<IPostRepository>('PostRepository', PostRepository);
container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository,
);
