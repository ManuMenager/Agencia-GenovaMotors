/** Error esperado de la aplicación: el manejador global lo traduce a una respuesta HTTP. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message)
  }
}

export const notFound = (message: string) => new AppError(404, message)
export const unauthorized = (message = 'No autorizado') => new AppError(401, message)
