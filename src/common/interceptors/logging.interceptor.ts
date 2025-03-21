import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap(() => {
        // Loguear sólo las operaciones que no sean de lectura (excluyendo GET)
        if (method !== 'GET') {
          const logMessage = `${new Date().toISOString()} - ${method} ${url}\n`;
          const logPath = path.join(__dirname, '../../../logs/operations.log');
          fs.appendFile(logPath, logMessage, (err) => {
            if (err) {
              console.error('Error al escribir en el log', err);
            }
          });
        }
      }),
    );
  }
}
