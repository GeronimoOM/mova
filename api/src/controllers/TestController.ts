import { Controller, Get } from '@nestjs/common';

@Controller('/api/test')
export class TestController {
  @Get('/')
  test(): string {
    return 'mova:ok';
  }
}
