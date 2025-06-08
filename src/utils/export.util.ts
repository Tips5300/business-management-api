import { Response } from 'express';
import { format as formatDate } from 'date-fns';
import fastcsv from 'fast-csv';
import XLSX from 'xlsx';

export type PlainObject = Record<string, any>;

export function exportJSON(data: PlainObject[], res: Response) {
  res.setHeader('Content-Disposition', `attachment; filename="export.json"`);
  return res.json(data);
}

export function exportCSV(data: PlainObject[], res: Response) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="export_${formatDate(new Date(), 'yyyyMMdd_HHmmss')}.csv"`
  );
  const ws = fastcsv.format({ headers: true });
  ws.pipe(res);
  data.forEach((row) => ws.write(row));
  ws.end();
}

export function exportXLSX(data: PlainObject[], res: Response) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="export_${formatDate(new Date(), 'yyyyMMdd_HHmmss')}.xlsx"`
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  return res.send(buf);
}

export function exportData(format: 'json' | 'csv' | 'xlsx', data: PlainObject[], res: Response) {
  if (format === 'csv') return exportCSV(data, res);
  if (format === 'xlsx') return exportXLSX(data, res);
  return exportJSON(data, res);
}