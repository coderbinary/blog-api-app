export class ApiError extends Error {
  constructor(
    status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}