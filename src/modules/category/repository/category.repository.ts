import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category } from '../category.entity';
import { ICategoryRepository } from './category.repository.interface';

@injectable()
export class CategoryRepository implements ICategoryRepository {
  private ormRepository: Repository<Category>;
  constructor() {
    this.ormRepository = getRepository(Category);
  }
  public async getCategories(): Promise<Category[]> {
    return await this.ormRepository.find();
  }
  public async getCategoryById(id: string): Promise<Category> {
    return await this.ormRepository.findOne({
      where: { id: id },
    });
  }
  public async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.ormRepository.create(categoryDto);
    await this.ormRepository.save(category);
    return category;
  }

  public async updateCategory(
    category: Category,
    categoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updated = Object.assign(category, categoryDto);
    await this.ormRepository.save(updated);
    return updated;
  }
  public async deleteCategory(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
