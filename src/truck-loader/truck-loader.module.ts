import { Module } from '@nestjs/common';
import { TruckLoaderController } from './truck-loader.controller';
import { TruckLoaderService } from './truck-loader.service';

@Module({
  controllers: [TruckLoaderController],
  providers: [TruckLoaderService]
})
export class TruckLoaderModule {}
