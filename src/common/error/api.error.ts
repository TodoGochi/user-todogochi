import { HttpException } from '@nestjs/common';
import { ERRORS } from './errors';

export class ApiError extends HttpException {
  constructor(apiError: keyof typeof ERRORS) {
    const error = ERRORS[apiError];
    super(error, error.statusCode);
  }
}
