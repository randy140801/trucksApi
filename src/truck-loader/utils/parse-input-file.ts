import { ItemDto } from '../dto/truck-load.dto';
import { parseCsv } from './csv-parser';

export async function parseInputFile(fileBuffer: Buffer): Promise<ItemDto[]> {
  const content = fileBuffer.toString('utf-8').trim();
  if (content.startsWith('{') || content.startsWith('[')) {
    try {
      const json = JSON.parse(content);
      if (Array.isArray(json)) return json as ItemDto[];
      if (json.items && Array.isArray(json.items))
        return json.items as ItemDto[];
      throw new Error('JSON no tiene formato esperado');
    } catch {
      console.error('Error parsing JSON:', content);
    }
  }
  return parseCsv(content);
}
