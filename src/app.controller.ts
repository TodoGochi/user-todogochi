import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiError } from './common/error/api.error';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new ApiError('USER-0000');
    return this.appService.getHello();
  }
}
