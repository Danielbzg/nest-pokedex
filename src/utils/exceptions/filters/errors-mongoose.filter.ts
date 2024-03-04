import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.code) {
      case 11000:
        status = HttpStatus.BAD_REQUEST;
        // duplicate exception
        // do whatever you want here, for instance send error to client
        response.status(status).json({
          statusCode: status,
          message: `Data exist in db: [${Object.keys(exception.keyPattern)}]`,
          error: 'Bad Request',
        });
        break;
      default:
        response.status(status).json({
          statusCode: status,
          message: 'Internal Server Error',
        });
        break;
    }
  }
}
