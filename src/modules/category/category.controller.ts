import express, { NextFunction, Request, Response } from 'express';
import { container, injectable } from 'tsyringe';
import { CategoryService } from './category.service';
import handler from 'express-async-handler';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { NotFoundException } from '@common/exceptions';
import { authMiddleware, validationMiddleware } from '@common/middleware';

@injectable()
export class CategoryController {
  public path = '/categories';
  public router = express.Router();
  private categoryService: CategoryService;
  constructor() {
    this.categoryService = container.resolve(CategoryService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(this.path, handler(this.index));
    this.router.get(`${this.path}/:id`, handler(this.show));

    this.router.post(
      `${this.path}`,
      authMiddleware(),
      validationMiddleware(CreateCategoryDto),
      handler(this.new),
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware(),
      validationMiddleware(UpdateCategoryDto),
      handler(this.update),
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware(),
      handler(this.delete),
    );
  }

  /* Private methods for routes */

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getCategories();
      res.send(categories);
    } catch (error) {
      next(error);
    }
  };

  private show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const category = await this.categoryService.getCategoryById(id);
      res.send(category);
    } catch (error) {
      next(error);
    }
  };

  private new = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catDto = req.body as CreateCategoryDto;
      const category = await this.categoryService.createCategory(catDto);
      res.send(category);
    } catch (error) {
      next(error);
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const catDto = req.body as UpdateCategoryDto;
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        next(new NotFoundException(`Category with id ${id} not found`));
      }
      const catUpdated = await this.categoryService.updateCategory(
        category,
        catDto,
      );
      res.send(catUpdated);
    } catch (error) {
      next(error);
    }
  };

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.categoryService.deleteCategory(id);
      res.send({ message: `Delete successfully category with id ${id}` });
    } catch (error) {
      next(error);
    }
  };
}
