import { AppError } from './AppError';

export { AppError };

/**
 * Crée une erreur 400 Bad Request.
 * À utiliser quand les données envoyées par le client sont incorrectes.
 * Exemple : latitude hors limites, champ manquant…
 */
export const badRequest = (message: string) => new AppError(400, message);

/**
 * Crée une erreur 404 Not Found.
 * À utiliser quand une ressource demandée n'existe pas en base.
 */
export const notFound = (message: string) => new AppError(404, message);

/**
 * Crée une erreur 500 Internal Server Error.
 * À utiliser pour les erreurs inattendues côté serveur.
 */
export const serverError = (message: string) => new AppError(500, message);
