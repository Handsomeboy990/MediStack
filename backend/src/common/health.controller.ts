import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

// Liveness probe, useful for Railway and monitoring.
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      data: {
        status: 'ok',
        service: 'meditrust-backend',
        timestamp: new Date().toISOString(),
      },
      meta: null,
    };
  }
}
