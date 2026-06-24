<script setup lang="ts">
import { ref } from 'vue';
import { CUISINE_TYPES, CUISINE_COLORS, CUISINE_EMOJIS } from '../models/restaurant.model';
import type { Restaurant } from '../models/restaurant.model';

const props = defineProps<{
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  paginated: { total: number; page: number; limit: number; totalPages: number } | null;
  isFiltering: boolean;
}>();

const emit = defineEmits<{
  search: [q: string];
  filter: [cuisine: string];
  reset: [];
  page: [p: number];
}>();

const searchInput = ref('');
const selectedCuisine = ref('');

let searchTimeout: ReturnType<typeof setTimeout>;

/** Attend 300ms après la dernière frappe avant d'émettre la recherche (debounce). */
function onSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    selectedCuisine.value = '';
    emit('search', searchInput.value);
  }, 300);
}

/** Émet le filtre sélectionné et vide la recherche texte. */
function onFilter() {
  searchInput.value = '';
  emit('filter', selectedCuisine.value);
}

/** Vide les champs de recherche et émet l'événement reset. */
function onReset() {
  searchInput.value = '';
  selectedCuisine.value = '';
  emit('reset');
}

/** Formate une coordonnée GPS avec 6 décimales (précision au décimètre). */
function formatCoord(val: number): string {
  return val.toFixed(6);
}
</script>

<template>
  <div class="restaurant-list">
    <div class="list-header">
      <h2>
        Restaurants
        <span class="count" v-if="!loading">
          {{ isFiltering ? `${restaurants.length} résultat(s)` : `${paginated?.total ?? 0} au total` }}
        </span>
      </h2>

      <div class="filters">
        <input
          v-model="searchInput"
          @input="onSearch"
          type="search"
          placeholder="Rechercher par nom ou adresse..."
          class="search-input"
        />

        <select v-model="selectedCuisine" @change="onFilter" class="filter-select">
          <option value="">Toutes les cuisines</option>
          <option v-for="type in CUISINE_TYPES" :key="type" :value="type">
            {{ CUISINE_EMOJIS[type] }} {{ type }}
          </option>
        </select>

        <button v-if="isFiltering" @click="onReset" class="btn-reset">✕ Réinitialiser</button>
      </div>
    </div>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else-if="restaurants.length === 0" class="empty">
      Aucun restaurant trouvé.
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Restaurant</th>
          <th>Adresse</th>
          <th>Cuisine</th>
          <th>Coordonnées</th>
          <th>Téléphone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in restaurants" :key="r.id">
          <td class="cell-name">{{ r.name }}</td>
          <td class="cell-address">{{ r.address }}</td>
          <td>
            <span
              class="cuisine-badge"
              :style="{ background: CUISINE_COLORS[r.cuisine_type] + '1A', color: CUISINE_COLORS[r.cuisine_type], borderColor: CUISINE_COLORS[r.cuisine_type] + '40' }"
            >
              {{ CUISINE_EMOJIS[r.cuisine_type] }} {{ r.cuisine_type }}
            </span>
          </td>
          <td class="cell-coords">
            <span class="coord">lat: {{ formatCoord(r.latitude) }}</span>
            <span class="coord">lng: {{ formatCoord(r.longitude) }}</span>
          </td>
          <td class="cell-phone">{{ r.phone_number ?? '—' }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!isFiltering && paginated && paginated.totalPages > 1" class="pagination">
      <button
        @click="emit('page', paginated.page - 1)"
        :disabled="paginated.page <= 1"
        class="page-btn"
      >← Précédent</button>

      <span class="page-info">Page {{ paginated.page }} / {{ paginated.totalPages }}</span>

      <button
        @click="emit('page', paginated.page + 1)"
        :disabled="paginated.page >= paginated.totalPages"
        class="page-btn"
      >Suivant →</button>
    </div>
  </div>
</template>

<style scoped>
.restaurant-list {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}

.list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #111;
  display: flex;
  align-items: center;
  gap: 10px;
}

.count {
  font-size: .85rem;
  font-weight: 400;
  color: #6B7280;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: .9rem;
  width: 240px;
}

.filter-select {
  padding: 8px 12px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: .9rem;
  background: #fff;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: #3B82F6;
}

.btn-reset {
  padding: 8px 14px;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  background: #fff;
  font-size: .85rem;
  color: #6B7280;
  cursor: pointer;
}
.btn-reset:hover { background: #F9FAFB; }

.error-banner {
  background: #FEE2E2;
  color: #B91C1C;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: .9rem;
}

.loading, .empty {
  text-align: center;
  padding: 48px;
  color: #9CA3AF;
  font-size: .95rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
}

.table thead th {
  text-align: left;
  padding: 10px 14px;
  font-size: .78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #6B7280;
  border-bottom: 1.5px solid #E5E7EB;
}

.table tbody tr:hover { background: #F9FAFB; }

.table td {
  padding: 12px 14px;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
}

.cell-name { font-weight: 600; color: #111; }
.cell-address { color: #4B5563; max-width: 220px; }
.cell-phone { color: #6B7280; white-space: nowrap; }

.cuisine-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: .8rem;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
}

.cell-coords {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.coord {
  font-family: monospace;
  font-size: .82rem;
  color: #374151;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #F3F4F6;
}

.page-btn {
  padding: 7px 16px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  background: #fff;
  font-size: .88rem;
  cursor: pointer;
  transition: background .15s;
}
.page-btn:hover:not(:disabled) { background: #F3F4F6; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }

.page-info { font-size: .88rem; color: #6B7280; }
</style>