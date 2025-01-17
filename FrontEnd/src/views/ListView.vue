<script setup lang="ts">
import DateDisplay from '@/components/DateDisplay.vue'
import FuelProposalModal from '@/components/FuelProposalModal.vue'
import http from '@/http'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'

onMounted(() => {
  fetchFuelStations()
})

const stations = ref<any>(null)
const modalStation = ref<any>(null)
const isFuelProposalModalVisible = ref(false)

async function fetchFuelStations() {
  try {
    const response = await http.get('/api/stations')
    stations.value = response.data
    console.log(response.data)
    if (!response.data.length) {
      useToast().warning(`Brak stacji do wyświetlenia`)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    useToast
  }
}

function getBrandImage(brand: any) {
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

function showFuelProposalModal(station: any) {
  isFuelProposalModalVisible.value = true
  modalStation.value = station
}
</script>

<template>
  <div class="grid grid-cols-1 gap-2 pr-16">
    <div
      v-for="station in stations"
      :key="station.id"
      class="grid grid-cols-[auto,1fr,1fr,1fr] p-4 border border-gray-300 rounded-lg shadow-sm"
    >
      <!-- Logo -->
      <img
        :src="`/src/assets/${getBrandImage(station.brand)}`"
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
          <!-- <div class="font-semibold text-center text-green-700">PB95</div> -->
          <!-- <div class="font-semibold text-center text-green-600">PB98</div> -->
          <div class="font-semibold text-center text-green-600">PB</div>
          <div class="font-semibold text-center">ON</div>
          <div class="font-semibold text-center text-blue-500">LPG</div>
        </div>

        <div class="content-start grid grid-cols-[1fr,1fr,1fr] gap-2 text-gray-700">
          <!-- <div class="font-semibold text-center">
            {{ station.fuel_gasoline_95 ?? '-' }}
          </div> -->
          <!-- <div class="font-semibold text-center">
            {{ station.fuel_gasoline_98 ?? '-' }}
          </div> -->
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
      <button @click="showFuelProposalModal(station)" class="object-contain mx-auto">
        Zmień ceny paliw
      </button>
    </div>
  </div>
  <FuelProposalModal
    :station="modalStation"
    :isVisible="isFuelProposalModalVisible"
    @close="isFuelProposalModalVisible = false"
  />
</template>
