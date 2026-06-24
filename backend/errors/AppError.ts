export class AppError<T = undefined> extends Error {
  public code: number;
  public data?: T;

  constructor(code: number, message: string, data?: T) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}