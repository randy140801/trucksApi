import { Test, TestingModule } from '@nestjs/testing';
import { TruckLoaderController } from './truck-loader.controller';

describe('TruckLoaderController', () => {
  let controller: TruckLoaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TruckLoaderController],
    }).compile();

    controller = module.get<TruckLoaderController>(TruckLoaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
