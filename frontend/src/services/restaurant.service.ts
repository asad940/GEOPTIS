import axios from 'axios';
import type { CreateRestaurantDto } from '../models/restaurant.model';

const BASE = '/api/restaurants';

export const restaurantService = {
  /** Récupère une page de restaurants. */
  getAll(page: number, limit: number) {
    return axios.get(BASE, { params: { page, limit } }).then(r => r.data);
  },

  /** Recherche par nom ou adresse (insensible à la casse). */
  search(q: string) {
    return axios.get(`${BASE}/search`, { params: { q } }).then(r => r.data);
  },

  /** Filtre par type de cuisine. */
  filter(cuisine: string) {
    return axios.get(`${BASE}/filter`, { params: { cuisine } }).then(r => r.data);
  },

  /** Envoie un nouveau restaurant au serveur. */
  create(data: CreateRestaurantDto) {
    return axios.post(BASE, data).then(r => r.data);
  },
};