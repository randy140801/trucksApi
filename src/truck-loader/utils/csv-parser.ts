import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { ItemDto } from '../dto/truck-load.dto';

export async function parseCsv(csvString: string): Promise<ItemDto[]> {
  return new Promise<ItemDto[]>((resolve, reject) => {
    const results: ItemDto[] = [];
    const separator = csvString.includes(';') ? ';' : ',';
    Readable.from([csvString])
      .pipe(csvParser({ separator }))
      .on('data', (data) => {
        const cleaned = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key.trim().replace(/^\uFEFF/, ''),
            value,
          ]),
        );
        const item: ItemDto = {
          itemId: String(cleaned['Item ID']),
          length: Number(cleaned['Length']),
          width: Number(cleaned['Width']),
          height: Number(cleaned['Height']),
          quantity: Number(cleaned['Quantity']),
          weight: Number(cleaned['Weight']),
        };
        results.push(item);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}
