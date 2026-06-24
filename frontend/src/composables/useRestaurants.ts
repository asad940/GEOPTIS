import { ref, computed } from 'vue';
import { restaurantService } from '../services/restaurant.service';
import type { CreateRestaurantDto } from '../models/restaurant.model';

export function useRestaurants() {
  const paginated = ref<any>(null);
  const filteredList = ref<any[]>([]);
  const loading = ref(false);
  const error = ref('');

  const page = ref(1);
  const limit = ref(10);
  const search = ref('');
  const cuisineFilter = ref('');

  // true si une recherche ou un filtre est actif
  const isFiltering = computed(() => search.value.trim() !== '' || cuisineFilter.value !== '');

  // retourne la liste filtrée ou la page courante selon le contexte
  const restaurants = computed(() =>
    isFiltering.value ? filteredList.value : (paginated.value?.data ?? [])
  );

  /** Appelle l'endpoint approprié selon l'état (recherche, filtre ou pagination). */
  async function fetchRestaurants() {
    loading.value = true;
    error.value = '';
    try {
      if (search.value.trim()) {
        filteredList.value = await restaurantService.search(search.value.trim());
      } else if (cuisineFilter.value) {
        filteredList.value = await restaurantService.filter(cuisineFilter.value);
      } else {
        paginated.value = await restaurantService.getAll(page.value, limit.value);
      }
    } catch (err: any) {
      error.value = err.response?.data?.error ?? 'Erreur lors du chargement';
    } finally {
      loading.value = false;
    }
  }

  /** Crée un restaurant puis recharge la liste depuis le serveur. */
  async function addRestaurant(data: CreateRestaurantDto) {
    await restaurantService.create(data);
    page.value = 1;
    search.value = '';
    cuisineFilter.value = '';
    await fetchRestaurants();
  }

  /** Change de page et recharge. */
  function goToPage(p: number) {
    page.value = p;
    fetchRestaurants();
  }

  /** Active la recherche par texte et désactive le filtre cuisine. */
  function applySearch(q: string) {
    search.value = q;
    cuisineFilter.value = '';
    fetchRestaurants();
  }

  /** Active le filtre par cuisine et désactive la recherche texte. */
  function applyFilter(cuisine: string) {
    cuisineFilter.value = cuisine;
    search.value = '';
    fetchRestaurants();
  }

  /** Réinitialise tous les filtres et revient à la page 1. */
  function reset() {
    search.value = '';
    cuisineFilter.value = '';
    page.value = 1;
    fetchRestaurants();
  }

  return {
    restaurants,
    paginated,
    loading,
    error,
    isFiltering,
    fetchRestaurants,
    addRestaurant,
    goToPage,
    applySearch,
    applyFilter,
    reset,
  };
}