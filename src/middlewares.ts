import { NextFunction, Request, Response } from 'express';

import ErrorResponse from './interfaces/responses/ErrorResponse';
import { users } from './logic/users';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    error: err.message,
  });
}

export async function userHandler(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.username && !req.headers.userId) {
        return res.status(403).send({ error: 'No user available in request.' });
    }

    if (req.headers.userId) {
        req.user = await users.existsAccount(req.headers.userId as string, '_id');
    } else {
        req.user = await users.existsAccount(req.headers.username as string, 'username');
    }

    if (!req.user && req.headers.username) {
        req.user = await users.createAccount(req.headers.username as string);
    }

    if (!req.user) {
        return res.status(403).send({ error: 'Failed to create user.' });
    }
    
    return next();
}