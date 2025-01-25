<script setup lang="ts">
import type Station from '@/models/Station';
import ModalBase from './ModalBase.vue';
import { ref } from 'vue';
import http from '@/http';
import router from '@/router';

const emit = defineEmits(['close', 'refresh'])

const props = defineProps<{
  isVisible: boolean
  station: Station | null
}>()

const errorMessage = ref('')

function editStation() {
  validate()
  if (errorMessage.value != '') {
    return
  }
  const request = {
    name: props.station!.brand,
    brand: props.station!.brand.toUpperCase(),
    address: props.station!.address,
    latitude: props.station!.latitude,
    longitude: props.station!.longitude,
    fuel_gasoline: props.station!.fuel_gasoline,
    fuel_diesel: props.station!.fuel_diesel,
    fuel_lpg: props.station!.fuel_lpg,
  }
  http.patch(`/api/admin/stations/${props.station!.id}`, request).then((response) => {
    emit('refresh')
    emit('close')
  })
}

function validate() {
  errorMessage.value = ''
  if (props.station!.brand == '') {
    errorMessage.value = 'Należy podać nazwę'
    return
  }

  if (props.station!.address == '') {
    errorMessage.value = 'Należy podać adres'
    return
  }

  if (props.station!.latitude < -90 || props.station!.latitude > 90) {
    errorMessage.value = 'Należy podać szerokość geograficzną (od -90 do 90)'
    return
  }

  if (props.station!.longitude < -90 || props.station!.longitude > 90) {
    errorMessage.value = 'Należy podać długość geograficzną (od -180 do 180)'
    return
  }
}
</script>

<template>
    <ModalBase @close="$emit('close')" :isVisible="isVisible">
        <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-semibold text-center mb-6">Edytuj stację paliw</h1>

        <div v-if="errorMessage" class="text-red-600 text-center mb-4">{{ errorMessage }}</div>

        <!-- Informacje o stacji -->
        <div class="mb-6">
        <p class="text-gray-600">
            <span class="font-medium text-blue-600">Wybierz markę stacji: </span>
            <select
            v-model="station!.brand"
            class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            >
            <option value="" disabled selected>Wybierz markę stacji</option>
            <option value="ORLEN">Orlen</option>
            <option value="BP">BP</option>
            <option value="SHELL">Shell</option>
            <option value="LOTOS">Lotos</option>
            <option value="DP">DP</option>
            <option value="PIEPRZYK">Pieprzyk</option>
            </select>
        </p>
        <p class="text-gray-600">
            <span class="font-medium text-blue-600">Lokalizacja: </span>
            <input
            v-model="station!.address"
            type="text"
            class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Wprowadź adres stacji"
            required
            />
        </p>
        <p class="text-gray-600">
            <span class="font-medium text-blue-600">Szerokość geograficzna: </span>
            <input
            v-model="station!.latitude"
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
            v-model="station!.longitude"
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
        <form @submit.prevent="editStation">
        <div class="mb-4">
            <label for="fuel_gasoline" class="block text-sm font-medium text-gray-700">Cena PB</label>
            <input
            id="fuel_gasoline"
            v-model="station!.fuel_gasoline"
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
            v-model="station!.fuel_diesel"
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
            v-model="station!.fuel_lpg"
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
            class="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
            >
            Zatwierdź zmianę
            </button>
        </div>
    </form>
    </div>
    </ModalBase>
</template>