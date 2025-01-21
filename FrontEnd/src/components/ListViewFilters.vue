<script setup lang="ts">
import type Station from '@/models/Station'
import { ref } from 'vue'

const emit = defineEmits(['filter'])

const props = defineProps<{
  stations: Station[]
}>()

const selectedBrand = ref('')
const selectedFuelType = ref('')
const selectedSort = ref('')

function applyFilters() {
  let filteredStations = props.stations
  if (selectedBrand.value != '') {
    filteredStations = filterByBrand(filteredStations)
  }
  if (selectedFuelType.value != '') {
    filteredStations = filterByFuelType(filteredStations)
  }
  if (selectedSort.value != '') {
    filteredStations = sort(filteredStations)
  }

  emit('filter', filteredStations)
}

function filterByBrand(stations: Station[]) {
  const filteredStations = stations.filter((station) => {
    if (station.brand != selectedBrand.value) {
      return false
    }
    return true
  })
  return filteredStations
}

function filterByFuelType(stations: Station[]) {
  const filteredStations = stations.filter((station) => {
    if (selectedFuelType.value == 'fuel_gasoline' && station.fuel_gasoline) {
      return true
    }
    if (selectedFuelType.value == 'fuel_diesel' && station.fuel_diesel) {
      return true
    }
    if (selectedFuelType.value == 'fuel_lpg' && station.fuel_lpg) {
      return true
    }
    return false
  })
  return filteredStations
}

function sort(stations: Station[]) {
  if (selectedSort.value == 'fuel_gasoline') {
    const sortedStations = stations.sort((a, b) => {
      const priceA = a.fuel_gasoline === null ? Infinity : a.fuel_gasoline
      const priceB = b.fuel_gasoline === null ? Infinity : b.fuel_gasoline

      return priceA - priceB
    })
    return sortedStations
  }
  if (selectedSort.value == 'fuel_diesel') {
    const sortedStations = stations.sort((a, b) => {
      const priceA = a.fuel_diesel === null ? Infinity : a.fuel_diesel
      const priceB = b.fuel_diesel === null ? Infinity : b.fuel_diesel

      return priceA - priceB
    })
    return sortedStations
  }
  if (selectedSort.value == 'fuel_lpg') {
    const sortedStations = stations.sort((a, b) => {
      const priceA = a.fuel_lpg === null ? Infinity : a.fuel_lpg
      const priceB = b.fuel_lpg === null ? Infinity : b.fuel_lpg

      return priceA - priceB
    })
    return sortedStations
  }
  if (selectedSort.value == 'last_updated') {
    const sortedStations = stations.sort((a, b) => {
      const dateA = new Date(a.last_updated).getTime()
      const dateB = new Date(b.last_updated).getTime()

      return dateB - dateA
    })
    return sortedStations
  }
  return stations
}

function clearFilters() {
  selectedBrand.value = ''
  selectedFuelType.value = ''
  selectedSort.value = ''
  applyFilters()
}
</script>

<template>
  <div class="grid grid-cols-[1fr,1fr,1fr,1fr] gap-2 pr-16">
    <div>
      Filtruj po marce
      <select
        @change="applyFilters()"
        v-model="selectedBrand"
        class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      >
        <option value="" selected>Wybierz markę stacji</option>
        <option value="ORLEN">Orlen</option>
        <option value="BP">BP</option>
        <option value="SHELL">Shell</option>
        <option value="LOTOS">Lotos</option>
        <option value="DP">DP</option>
        <option value="PIEPRZYK">Pieprzyk</option>
      </select>
    </div>
    <div>
      Filtruj po typie paliwa
      <select
        @change="applyFilters()"
        v-model="selectedFuelType"
        class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      >
        <option value="" selected>Wybierz typ paliwa</option>
        <option value="fuel_gasoline">PB</option>
        <option value="fuel_diesel">ON</option>
        <option value="fuel_lpg">LPG</option>
      </select>
    </div>
    <div>
      Sortuj
      <select
        @change="applyFilters()"
        v-model="selectedSort"
        class="mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      >
        <option value="" selected>Wybierz sortowanie</option>
        <option value="fuel_gasoline">PB</option>
        <option value="fuel_diesel">ON</option>
        <option value="fuel_lpg">LPG</option>
        <option value="last_updated">Ostatnia aktualizacja</option>
      </select>
    </div>
    <div>
      <button @click="clearFilters">Wyczyść filtry</button>
    </div>
  </div>
</template>

<!-- 
filtr na markę -> pokazuje tylko stacje z wybraną marką
filtr na rodzaj paliwa -> pokazuje stacje z dostępnym danym rodzajem paliwa
filtr na datę ostatniej aktualizacji -> pokazuje stacje od ostatniej aktualizacji do najstarszej aktualizacji
filtr na ceny -> pokazuje stacje z ogólnie najtańszymi cenami paliw
-->
