import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

// Codes d'erreur PostgreSQL
const PG_CHECK_VIOLATION    = '23514'; // contrainte CHECK violée (ex: latitude hors limites)
const PG_NOT_NULL_VIOLATION = '23502'; // colonne NOT NULL reçoit null
const PG_UNIQUE_VIOLATION   = '23505'; // valeur dupliquée sur une colonne UNIQUE
const PG_STRING_TOO_LONG    = '22001'; // valeur trop longue pour VARCHAR(n)

/**
 * Gestion centralisée des erreurs — doit être enregistré EN DERNIER dans app.ts.
 * Intercepte les AppError lancées dans les services et les erreurs PostgreSQL.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.code).json({ error: err.message, data: err.data ?? null });
    return;
  }

  if (err.code === PG_CHECK_VIOLATION) {
    res.status(400).json({ error: 'Coordonnées géographiques hors limites (latitude: -90/90, longitude: -180/180)' });
    return;
  }

  if (err.code === PG_NOT_NULL_VIOLATION) {
    res.status(400).json({ error: `Le champ "${err.column}" est obligatoire` });
    return;
  }

  if (err.code === PG_UNIQUE_VIOLATION) {
    res.status(409).json({ error: 'Un restaurant avec ces données existe déjà' });
    return;
  }

  if (err.code === PG_STRING_TOO_LONG) {
    res.status(400).json({ error: 'Un champ dépasse la longueur maximale autorisée (nom: 255 caractères, adresse: 500 caractères)' });
    return;
  }

  console.error('[Erreur non gérée]', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
}