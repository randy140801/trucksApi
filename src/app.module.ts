import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TruckLoaderModule } from './truck-loader/truck-loader.module';

@Module({
  imports: [TruckLoaderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
