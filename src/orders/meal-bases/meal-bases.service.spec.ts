import { Test, TestingModule } from '@nestjs/testing';
import { MealBasesService } from './meal-bases.service';

describe('MealBasesService', () => {
  let service: MealBasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealBasesService],
    }).compile();

    service = module.get<MealBasesService>(MealBasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
