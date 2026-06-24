import { Request, Response } from 'express';
import * as service from '../services/restaurantService';
import { asyncHandler } from '../middleware/asyncHandler';

/** Retourne la liste paginée. Paramètres optionnels : page (défaut 1), limit (défaut 10, max 100). */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

  const result = await service.getAllRestaurants(page, limit);
  res.json(result);
});

/** Recherche des restaurants par nom ou adresse. Paramètre requis : q. */
export const search = asyncHandler(async (req: Request, res: Response) => {
  const results = await service.searchRestaurants(req.query.q as string);
  res.json(results);
});

/** Filtre les restaurants par type de cuisine. Paramètre requis : cuisine. */
export const filter = asyncHandler(async (req: Request, res: Response) => {
  const results = await service.filterRestaurants(req.query.cuisine as string);
  res.json(results);
});

/** Crée un nouveau restaurant. Retourne le restaurant créé avec son id (HTTP 201). */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await service.createRestaurant(req.body);
  res.status(201).json(restaurant);
});