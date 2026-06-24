<script setup lang="ts">
import { onMounted } from 'vue';
import { useRestaurants } from './composables/useRestaurants';
import RestaurantForm from './components/RestaurantForm.vue';
import RestaurantList from './components/RestaurantList.vue';

const {
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
} = useRestaurants();

onMounted(fetchRestaurants);
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1> GEOPTIS Restaurants</h1>
      <p>Gestion des emplacements de restaurants géolocalisés</p>
    </header>

    <main class="app-main">
      <RestaurantForm @submit="addRestaurant" />
<RestaurantList
        :restaurants="restaurants"
        :loading="loading"
        :error="error"
        :paginated="paginated"
        :is-filtering="isFiltering"
        @search="applySearch"
        @filter="applyFilter"
        @reset="reset"
        @page="goToPage"
      />
    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #F3F4F6;
  color: #111;
  min-height: 100vh;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
  padding: 20px 32px;
}

.app-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111;
}

.app-header p {
  margin-top: 4px;
  font-size: .88rem;
  color: #6B7280;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>