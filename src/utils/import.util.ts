import { Request } from 'express';
import { WorkBook } from 'xlsx';
import fastcsv from 'fast-csv';

export type PlainObject = Record<string, any>;

export async function parseImportFile(req: Request): Promise<PlainObject[]> {
  if (!req.file) {
    throw new Error('No file provided for import');
  }
  const mimetype = req.file.mimetype;
  const buffer = req.file.buffer;

  if (mimetype === 'application/json' || req.file.originalname.endsWith('.json')) {
    const str = buffer.toString('utf8');
    const parsed = JSON.parse(str);
    if (!Array.isArray(parsed)) {
      throw new Error('JSON import must be an array of objects');
    }
    return parsed;
  }

  if (
    mimetype === 'text/csv' ||
    req.file.originalname.endsWith('.csv') ||
    mimetype === 'application/vnd.ms-excel'
  ) {
    return new Promise<PlainObject[]>((resolve, reject) => {
      const results: PlainObject[] = [];
      fastcsv
        .parseString(buffer.toString('utf8'), { headers: true, ignoreEmpty: true })
        .on('error', (error) => reject(error))
        .on('data', (row) => results.push(row))
        .on('end', () => resolve(results));
    });
  }

  if (
    mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    req.file.originalname.endsWith('.xlsx')
  ) {
    const workbook: WorkBook = (await import('xlsx')).read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData: PlainObject[] = (await import('xlsx')).utils.sheet_to_json(worksheet, {
      defval: null,
    });
    return jsonData;
  }

  throw new Error('Unsupported file type for import');
}