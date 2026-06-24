import { Request, Response, NextFunction } from 'express';

/** Permet d'utiliser async/await dans les controllers sans try/catch.
 *  Si une erreur est lancée, elle est transmise automatiquement à errorHandler. */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}