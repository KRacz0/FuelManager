<script setup lang="ts">
import DateDisplay from '@/components/DateDisplay.vue'
import FuelProposalModal from '@/components/FuelProposalModal.vue'
import ListViewFilters from '@/components/ListViewFilters.vue'
import http from '@/http'
import type Station from '@/models/Station'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { getBrandImage } from '@/helpers'
import { useUserStore } from '@/stores/userStore'
import EditFuelStationModal from '@/components/EditFuelStationModal.vue'

onMounted(() => {
  fetchFuelStations()
})

const userStore = useUserStore()
const filteredStations = ref<Station[]>([])
const allStations = ref<Station[]>([])
const modalStation = ref<Station | null>(null)
const isFuelProposalModalVisible = ref(false)
const isFuelStationEditModalVisible = ref(false)

async function fetchFuelStations() {
  try {
    const response = await http.get('/api/stations')
    allStations.value = response.data
    clearFilters()
    if (!response.data.length) {
      useToast().warning(`Brak stacji do wyświetlenia`)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    useToast
  }
}

function showFuelProposalModal(station: Station) {
  isFuelProposalModalVisible.value = true
  modalStation.value = {... station}
}

function showEditFuelStationModal(station: Station) {
  isFuelStationEditModalVisible.value = true
  modalStation.value = {... station}
}

function clearFilters() {
  filteredStations.value = allStations.value
}

function applyFilters(stations: Station[]) {
  filteredStations.value = stations
}
</script>

<template>
  <ListViewFilters :stations="allStations" @filter="applyFilters" />
  <div class="grid grid-cols-1 gap-2 pr-16">
    <div
      v-for="station in filteredStations"
      :key="station.id"
      class="grid grid-cols-[auto,1fr,1fr,1fr] p-4 border border-gray-300 rounded-lg shadow-sm"
    >
      <!-- Logo -->
      <img
        :src="getBrandImage(station.brand)"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />

      <div class="">
        <!-- Nazwa stacji i adres -->
        <div class="font-bold text-lg text-center">{{ station.name }}</div>
        <div class="text-gray-700 text-center">{{ station.address }}</div>
        <div class="text-gray-500 text-center">
          Ostatnia aktualizacja: <DateDisplay :dateString="station.last_updated" />
        </div>
      </div>

      <div class="grid grid-rows-2 border-red-500 m-1">
        <!-- Paliwa i ceny -->
        <div class="content-end grid grid-cols-[1fr,1fr,1fr] gap-2 text-gray-700">
          <div class="font-semibold text-center text-green-600">PB</div>
          <div class="font-semibold text-center">ON</div>
          <div class="font-semibold text-center text-blue-500">LPG</div>
        </div>

        <div class="content-start grid grid-cols-[1fr,1fr,1fr] gap-2 text-gray-700">
          <div class="font-semibold text-center">
            {{ station.fuel_gasoline ?? '-' }}
          </div>
          <div class="font-semibold text-center">
            {{ station.fuel_diesel ?? '-' }}
          </div>
          <div class="font-semibold text-center">
            {{ station.fuel_lpg ?? '-' }}
          </div>
        </div>
      </div>
      <div>
      <button
        @click="showFuelProposalModal(station)"
        class="object-contain mx-auto inline w-50 px-1 py-1 mt-8 bg-primary text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
      >
        Zmień ceny paliw
      </button><br/>
      <button
      v-if="userStore.isAdmin"
        @click="showEditFuelStationModal(station)"
        class="object-contain mx-auto inline w-50 px-1 py-1 mb-8 mt-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
      >
        Edytuj stację paliw
      </button>
      </div>
    </div>
  </div>
  <FuelProposalModal
  :isVisible="isFuelProposalModalVisible"
    :station="modalStation"
    @close="isFuelProposalModalVisible = false"
  />
  <EditFuelStationModal
  :isVisible="isFuelStationEditModalVisible"
    :station="modalStation"
    @close="isFuelStationEditModalVisible = false"
    @refresh="fetchFuelStations"
  />
</template>
