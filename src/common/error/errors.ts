import { HttpStatusCode } from 'axios';

export const ERRORS = {
  'USER-0000': {
    errorCode: 'USER-0000',
    message: 'Unknown error, please contact server administrator',
    statusCode: HttpStatusCode.InternalServerError,
  },
  'USER-0001': {
    errorCode: 'USER-0001',
    message: 'Email already exists',
    statusCode: HttpStatusCode.Conflict,
  },
  'USER-0002': {
    errorCode: 'USER-0002',
    message: 'Password does not match',
    statusCode: HttpStatusCode.BadRequest,
  },
  'USER-0003': {
    errorCode: 'USER-0003',
    message: 'Access Denied',
    statusCode: HttpStatusCode.Unauthorized,
  },
  'USER-0004': {
    errorCode: 'USER-0004',
    message: 'User not found',
    statusCode: HttpStatusCode.NotFound,
  },
  'USER-0005': {
    errorCode: 'USER-0005',
    message: 'Not enough coin',
    statusCode: HttpStatusCode.BadRequest,
  },
};
