import { Test, TestingModule } from '@nestjs/testing';
import { TruckLoaderService } from './truck-loader.service';

describe('TruckLoaderService', () => {
  let service: TruckLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TruckLoaderService],
    }).compile();

    service = module.get<TruckLoaderService>(TruckLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
