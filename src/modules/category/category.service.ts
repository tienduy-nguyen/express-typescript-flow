import { BadRequestException } from '@common/exceptions';
import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@injectable()
export class CategoryService {
  private categoryRepository: Repository<Category>;
  constructor() {
    this.categoryRepository = getRepository(Category);
  }

  public async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  public async getCategoryById(id: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id: id } });
  }

  public async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.categoryRepository.create(categoryDto);
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
      const updated: Category = Object.assign(category, categoryDto);
      await this.categoryRepository.save(updated);
      return updated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
