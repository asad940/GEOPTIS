<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CUISINE_TYPES } from '../models/restaurant.model';
import type { CreateRestaurantDto, CuisineType } from '../models/restaurant.model';

const emit = defineEmits<{ submit: [data: CreateRestaurantDto] }>();

const form = reactive({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  cuisine_type: '' as CuisineType | '',
  phone_number: '',
});

const errors = reactive<Record<string, string>>({});
const submitting = ref(false);
const serverError = ref('');

/** Vérifie tous les champs et remplit l'objet errors. Retourne true si le formulaire est valide. */
function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k]);

  if (!form.name || form.name.trim().length < 3)
    errors.name = 'Minimum 3 caractères';
  else if (form.name.trim().length > 255)
    errors.name = 'Maximum 255 caractères';

  if (!form.address || form.address.trim().length < 10)
    errors.address = 'Minimum 10 caractères';
  else if (form.address.trim().length > 500)
    errors.address = 'Maximum 500 caractères';

  const lat = parseFloat(form.latitude);
  if (form.latitude === '' || isNaN(lat))
    errors.latitude = 'Valeur numérique requise';
  else if (lat < -90 || lat > 90)
    errors.latitude = 'Doit être entre -90 et 90';

  const lng = parseFloat(form.longitude);
  if (form.longitude === '' || isNaN(lng))
    errors.longitude = 'Valeur numérique requise';
  else if (lng < -180 || lng > 180)
    errors.longitude = 'Doit être entre -180 et 180';

  if (!form.cuisine_type)
    errors.cuisine_type = 'Sélectionner un type de cuisine';

  const phoneRegex = /^(\+?\d[\d\s\-().]{6,19})?$/;
  if (form.phone_number && !phoneRegex.test(form.phone_number))
    errors.phone_number = 'Format invalide (ex: +33 1 23 45 67 89)';

  return Object.keys(errors).length === 0;
}

/** Valide puis émet l'événement submit avec les données converties. Affiche l'erreur serveur si la création échoue. */
async function handleSubmit() {
  serverError.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    emit('submit', {
      name: form.name.trim(),
      address: form.address.trim(),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      cuisine_type: form.cuisine_type as CuisineType,
      phone_number: form.phone_number || undefined,
    });
    Object.assign(form, { name: '', address: '', latitude: '', longitude: '', cuisine_type: '', phone_number: '' });
  } catch (err: any) {
    serverError.value = err.message ?? 'Erreur lors de la création';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="restaurant-form" @submit.prevent="handleSubmit" novalidate>
    <h2>Ajouter un restaurant</h2>

    <div v-if="serverError" class="form-error-banner">{{ serverError }}</div>

    <div class="form-row">
      <div class="form-group" :class="{ error: errors.name }">
        <label for="name">Nom du restaurant *</label>
        <input id="name" v-model="form.name" type="text" placeholder="Le Comptoir du Relais" />
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>

      <div class="form-group" :class="{ error: errors.cuisine_type }">
        <label for="cuisine">Type de cuisine *</label>
        <select id="cuisine" v-model="form.cuisine_type">
          <option value="" disabled>Sélectionner...</option>
          <option v-for="type in CUISINE_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
        <span v-if="errors.cuisine_type" class="error-msg">{{ errors.cuisine_type }}</span>
      </div>
    </div>

    <div class="form-group" :class="{ error: errors.address }">
      <label for="address">Adresse *</label>
      <input id="address" v-model="form.address" type="text" placeholder="9 Carrefour de l'Odéon, 75006 Paris" />
      <span v-if="errors.address" class="error-msg">{{ errors.address }}</span>
    </div>

    <div class="form-row">
      <div class="form-group" :class="{ error: errors.latitude }">
        <label for="latitude">Latitude *</label>
        <input id="latitude" v-model="form.latitude" type="number" step="any" min="-90" max="90" placeholder="48.8529" />
        <span class="hint">Entre -90 et 90</span>
        <span v-if="errors.latitude" class="error-msg">{{ errors.latitude }}</span>
      </div>

      <div class="form-group" :class="{ error: errors.longitude }">
        <label for="longitude">Longitude *</label>
        <input id="longitude" v-model="form.longitude" type="number" step="any" min="-180" max="180" placeholder="2.3387" />
        <span class="hint">Entre -180 et 180</span>
        <span v-if="errors.longitude" class="error-msg">{{ errors.longitude }}</span>
      </div>

      <div class="form-group" :class="{ error: errors.phone_number }">
        <label for="phone">Téléphone</label>
        <input id="phone" v-model="form.phone_number" type="tel" placeholder="+33 1 44 27 07 97" />
        <span v-if="errors.phone_number" class="error-msg">{{ errors.phone_number }}</span>
      </div>
    </div>

    <button type="submit" class="btn-primary" :disabled="submitting">
      {{ submitting ? 'Enregistrement...' : 'Ajouter le restaurant' }}
    </button>
  </form>
</template>

<style scoped>
.restaurant-form {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}

h2 {
  margin: 0 0 24px;
  font-size: 1.2rem;
  color: #111;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

label {
  font-size: .85rem;
  font-weight: 600;
  color: #374151;
}

input, select {
  padding: 9px 12px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: .95rem;
  transition: border-color .15s;
  background: #fff;
}

input:focus, select:focus {
  outline: none;
  border-color: #3B82F6;
}

.form-group.error input,
.form-group.error select {
  border-color: #EF4444;
}

.error-msg {
  font-size: .78rem;
  color: #EF4444;
  font-weight: 500;
}

.hint {
  font-size: .75rem;
  color: #9CA3AF;
}

.form-error-banner {
  background: #FEE2E2;
  color: #B91C1C;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: .9rem;
}

.btn-primary {
  margin-top: 8px;
  padding: 10px 24px;
  background: #3B82F6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: .95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}

.btn-primary:hover:not(:disabled) { background: #2563EB; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
</style>