import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { TruckLoaderService } from './truck-loader.service';
import { TruckLoadDto } from './dto/truck-load.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { parseInputFile } from './utils/parse-input-file';

@Controller('truck-loader')
export class TruckLoaderController {
  constructor(private readonly service: TruckLoaderService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const items = file ? await parseInputFile(file.buffer) : body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException(
        'No items provided, or CSV is empty or malformed.',
      );
    }

    const requiredFields = [
      'itemId',
      'width',
      'height',
      'length',
      'quantity',
      'weight',
    ];
    for (const [index, item] of items.entries()) {
      for (const field of requiredFields) {
        if (
          item[field] === undefined ||
          item[field] === null ||
          item[field] === ''
        ) {
          throw new BadRequestException(
            `Missing field '${field}' in item at index ${index}.`,
          );
        }
      }
    }

    const dto: TruckLoadDto = {
      containerType: body.containerType,
      usePalletDimensions: body.usePalletDimensions === 'true',
      items,
    };

    return dto.usePalletDimensions
      ? this.service.packPallets(dto)
      : this.service.packItems(dto);
  }
}
