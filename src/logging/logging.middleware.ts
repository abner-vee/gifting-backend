import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log incoming request
    console.log(JSON.stringify({
      message: 'Incoming Request',
      method: req.method,
          url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    }, null, 2));

    // Capture outgoing response
    const originalSend = res.send;
    res.send = function (body: any) {
      // Attempt to parse JSON responses
      const contentType = res.getHeader('Content-Type');
      let parsedBody = body;

      if (contentType && String(contentType).includes('application/json')) {
        try {
          if (typeof body === 'string') {
            parsedBody = JSON.parse(body);
          } else if (Buffer.isBuffer(body)) {
            parsedBody = JSON.parse(body.toString());
          }
        } catch (e) {
          // Parsing failed - retain original body
        }
      }

      console.log(JSON.stringify({
        message: 'Outgoing Response',
        statusCode: res.statusCode,
        body: parsedBody,
        timestamp: new Date().toISOString()
      }, null, 2));

      // Restore original send function
      res.send = originalSend;
      return res.send(body);
    };

    next();
  }
}