import { Controller, Get } from '@nestjs/common';

// Liveness probe, useful for Railway and monitoring.
@Controller('health')
export class HealthController {
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
