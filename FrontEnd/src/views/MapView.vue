<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import DateDisplay from '@/components/DateDisplay.vue'
import http from '@/http'
import type Station from '@/models/Station'

let zoom = ref(13)
let center = ref([51.2064, 16.1554]) // Współrzędne Legnicy
const stations = ref<Station[]>([])

onMounted(() => {
  fetchFuelStations()
})

async function fetchFuelStations() {
  try {
    const response = await http.get('/api/stations')
    stations.value = response.data
    if (!response.data.length) {
      useToast().warning(`Brak stacji do wyświetlenia`)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    useToast
  }
}

function getBrandImage(brand: string) {
  if (brand == 'ORLEN') {
    return 'Orlen_logo.png'
  }
  if (brand == 'BP') {
    return 'BP_logo.png'
  }
  if (brand == 'SHELL') {
    return 'Shell_logo.png'
  }
  if (brand == 'LOTOS') {
    return 'Lotos_logo.png'
  }
  if (brand == 'DP') {
    return 'DP_logo.png'
  }
  if (brand == 'PIEPRZYK') {
    return 'Pieprzyk_logo.png'
  }
  return 'ceny_paliwek_logo.png'
}
</script>

<template>
  <div id="map">
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">
      <l-tile-layer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap"
      ></l-tile-layer>
      <l-marker
        v-for="station in stations"
        :key="station.id"
        :lat-lng="[station.latitude, station.longitude]"
      >
        <l-icon
          class=""
          :iconUrl="`/src/assets/${getBrandImage(station.brand)}`"
          :iconSize="[64, 56]" />
        <l-popup>
          <div>
            <div class="font-bold text-lg text-center">{{ station.name }}</div>
            <div class="text-gray-700 text-center">{{ station.address }}</div>

            <div class="text-gray-700 text-center">
              <div class="inline text-green-500">PB:&nbsp;</div>
              {{ station.fuel_gasoline ?? '-' }}
            </div>
            <div class="text-gray-700 text-center">
              <div class="inline">ON:&nbsp;</div>
              {{ station.fuel_diesel ?? '-' }}
            </div>
            <div class="text-gray-700 text-center">
              <div class="inline text-blue-500">LPG:&nbsp;</div>
              {{ station.fuel_lpg ?? '-' }}
            </div>

            <div class="text-gray-500 text-center">
              Ostatnia aktualizacja: <DateDisplay :dateString="station.last_updated" />
            </div>
          </div> </l-popup
      ></l-marker>
    </l-map>
  </div>
</template>

<style>
#map {
  height: 60vh;
  width: 80%;
}
.leaflet-popup-content > * {
  display: block !important;
}
</style>
