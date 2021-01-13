import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category } from '../category.entity';

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(catDto: CreateCategoryDto): Promise<Category | undefined>;
  updateCategory(
    category: Category,
    catDto: UpdateCategoryDto,
  ): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;
}
