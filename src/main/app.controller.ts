import { container, injectable } from 'tsyringe';
import { IController } from '@common/interfaces/controller.interface';
import { PostController } from '@modules/posts/post.controller';
import { AuthController } from '@modules/auth/auth.controller';
import { CategoryController } from '@modules/category/category.controller';
import { AddressController } from '@modules/address/address.controller';

@injectable()
export class AppController {
  private _appControllers: IController[] = [];

  constructor() {
    this._getAllControllers();
  }

  public get all(): IController[] {
    return this._appControllers;
  }

  private _getAllControllers() {
    const postController = container.resolve(PostController);
    const authController = container.resolve(AuthController);
    const categoryController = container.resolve(CategoryController);
    const addressController = container.resolve(AddressController);

    this._appControllers.push(postController);
    this._appControllers.push(authController);
    this._appControllers.push(categoryController);
    this._appControllers.push(addressController);
  }
}
