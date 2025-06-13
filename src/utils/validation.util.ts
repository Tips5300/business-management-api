import { ValidationError } from 'class-validator';

export function formatValidationErrors(errors: ValidationError[]): any[] {
  return errors.map(error => ({
    property: error.property,
    value: error.value,
    constraints: error.constraints,
    children: error.children && error.children.length > 0 
      ? formatValidationErrors(error.children) 
      : undefined
  }));
}

export function createValidationError(message: string, property?: string): any {
  const error: any = new Error(message);
  error.status = 400;
  error.property = property;
  return error;
}