import { BadRequestException } from '@common/exceptions';
import { inject, injectable } from 'tsyringe';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ICategoryRepository } from './repository';

@injectable()
export class CategoryService {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  public async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.getCategories();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async getCategoryById(id: string): Promise<Category> {
    try {
      return await this.categoryRepository.getCategoryById(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const category = this.categoryRepository.createCategory(categoryDto);
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async updateCategory(
    category: Category,
    categoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const updated = await this.categoryRepository.updateCategory(
        category,
        categoryDto,
      );
      return updated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      await this.categoryRepository.deleteCategory(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
