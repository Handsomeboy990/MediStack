import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Wraps every success response in the { data, meta } structure.
// If the controller already returns an object containing data and meta, it is
// passed through unchanged so pagination is not broken.
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'data' in payload) {
          return payload;
        }
        return { data: payload, meta: null };
      }),
    );
  }
}
