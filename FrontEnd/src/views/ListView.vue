<script setup lang="ts">
import DateDisplay from '@/components/DateDisplay.vue'
import http from '@/http'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'

onMounted(() => {
  fetchFuelStations()
})

const stations = ref<any>(null)

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
</script>

<template>
  <div class="grid grid-cols-1 gap-2 pr-16">
    <div
      v-for="station in stations"
      :key="station.id"
      class="grid grid-cols-[auto,1fr,1fr] p-4 border border-gray-300 rounded-lg shadow-sm"
    >
      <!-- Logo -->
      <img
        v-if="station.brand == 'ORLEN'"
        src="@/assets/Orlen_logo.png"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />
      <img
        v-else-if="station.brand == 'BP'"
        src="@/assets/BP_logo.png"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />
      <img
        v-else-if="station.brand == 'SHELL'"
        src="@/assets/Shell_logo.png"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />
      <img
        v-else-if="station.brand == 'LOTOS'"
        src="@/assets/Lotos_logo.png"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />
      <img
        v-else-if="station.brand == 'DP'"
        src="@/assets/DP_logo.png"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />
      <img
        v-else-if="station.brand == 'PIEPRZYK'"
        src="@/assets/Pieprzyk_logo.png"
        alt="Logo"
        class="w-20 h-20 object-contain mx-auto"
      />
      <img
        v-else
        src="@/assets/ceny_paliwek_logo.png"
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
    </div>
  </div>
</template>
