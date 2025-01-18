<script setup lang="ts">
import http from '@/http'
import router from '@/router'
import { ref } from 'vue'

const brand = ref('')
const address = ref('')
const latitude = ref(0.0)
const longitude = ref(0.0)
const fuel_gasoline = ref(0)
const fuel_diesel = ref(0)
const fuel_lpg = ref(0)
const errorMessage = ref('')

function addStation() {
  validate()
  if (errorMessage.value != '') {
    return
  }
  const request = {
    name: brand.value,
    brand: brand.value.toUpperCase(),
    address: address.value,
    latitude: latitude.value,
    longitude: longitude.value,
    fuel_gasoline: fuel_gasoline.value,
    fuel_diesel: fuel_diesel.value,
    fuel_lpg: fuel_lpg.value,
  }
  http.post('/api/stations/', request).then((response) => {
    router.push({ name: 'list' })
  })
}

function validate() {
  errorMessage.value = ''
  if (brand.value == '') {
    errorMessage.value = 'Należy podać nazwę'
    return
  }

  if (address.value == '') {
    errorMessage.value = 'Należy podać adres'
    return
  }

  if (latitude.value < -90 || latitude.value > 90) {
    errorMessage.value = 'Należy podać szerokość geograficzną (od -90 do 90)'
    return
  }

  if (longitude.value < -90 || longitude.value > 90) {
    errorMessage.value = 'Należy podać długość geograficzną (od -180 do 180)'
    return
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-semibold text-center mb-6">Dodaj stację paliw</h1>

    <div v-if="errorMessage" class="text-red-600 text-center mb-4">{{ errorMessage }}</div>

    <!-- Informacje o stacji -->
    <div class="mb-6">
      <p class="text-gray-600">
        <span class="font-medium text-blue-600">Wybierz markę stacji: </span>
        <select
          v-model="brand"
          class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="" disabled selected>Wybierz markę stacji</option>
          <option value="Orlen">Orlen</option>
          <option value="BP">BP</option>
          <option value="Shell">Shell</option>
          <option value="Lotos">Lotos</option>
          <option value="DP">DP</option>
          <option value="Pieprzyk">Pieprzyk</option>
        </select>
      </p>
      <p class="text-gray-600">
        <span class="font-medium text-blue-600">Lokalizacja: </span>
        <input
          v-model="address"
          type="text"
          class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Wprowadź adres stacji"
          required
        />
      </p>
      <p class="text-gray-600">
        <span class="font-medium text-blue-600">Szerokość geograficzna: </span>
        <input
          v-model="latitude"
          type="number"
          class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Wprowadź adres stacji"
          step="0.000001"
          max="90"
          min="-90"
          required
        />
      </p>
      <p class="text-gray-600">
        <span class="font-medium text-blue-600">Długość geograficzna: </span>
        <input
          v-model="longitude"
          type="number"
          class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Wprowadź adres stacji"
          step="0.000001"
          max="180"
          min="-180"
          required
        />
      </p>
    </div>

    <!-- Zmiana cen paliw -->
    <form @submit.prevent="addStation">
      <div class="mb-4">
        <label for="fuel_gasoline" class="block text-sm font-medium text-gray-700">Cena PB</label>
        <input
          id="fuel_gasoline"
          v-model="fuel_gasoline"
          type="number"
          class="mt-1 inline w-50 px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Wprowadź cenę za PB"
          step="0.01"
        />
      </div>

      <div class="mb-4">
        <label for="fuel_diesel" class="block text-sm font-medium text-gray-700">Cena Diesel</label>
        <input
          id="fuel_diesel"
          v-model="fuel_diesel"
          type="number"
          class="mt-1 inline w-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Wprowadź cenę za Diesel"
          step="0.01"
        />
      </div>

      <div class="mb-4">
        <label for="fuel_lpg" class="block text-sm font-medium text-gray-700">Cena LPG</label>
        <input
          id="fuel_lpg"
          v-model="fuel_lpg"
          type="number"
          class="mt-1 inline w-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Wprowadź cenę za LPG"
          step="0.01"
        />
      </div>

      <!-- Przycisk Zatwierdź -->
      <div class="flex justify-center">
        <button
          type="submit"
          class="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
        >
          Zatwierdź zmianę
        </button>
      </div>
    </form>
  </div>
</template>
