<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/http'
import type FuelProposal from '@/models/FuelProposal'
import DateDisplay from '@/components/DateDisplay.vue'

const proposals = ref<FuelProposal[]>([])
const loading = ref(true)

onMounted(async () => {
  await loadProposals()
})

async function loadProposals() {
  try {
    const response = await http.get('/api/stations/proposals?status=pending')
    proposals.value = response.data
  } catch (error) {
    console.error('Błąd pobierania danych:', error)
  } finally {
    loading.value = false
  }
}

async function updateProposalStatus(fuelProposal: FuelProposal, status: string) {
  const request = { status: status }
  const response = await http.patch(`/api/stations/proposals/${fuelProposal.id}/status`, request)
  if (response.statusText == 'OK') {
    await loadProposals()
  }
}

function getFuelType(fuel_type: string) {
  if (fuel_type == 'fuel_gasoline') {
    return 'PB'
  }
  if (fuel_type == 'fuel_diesel') {
    return 'ON'
  }
  if (fuel_type == 'fuel_lpg') {
    return 'LPG'
  }
}

// async function showFuelProposalDetailsModal(fuelProposal: FuelProposal) {
//   const response = await http.get(`/api/stations/proposals/${fuelProposal.id}`)
//   console.log(response)
// }
//station_id
//user_id
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-semibold text-center mb-6">Lista propozycji</h1>

    <div v-if="loading" class="text-center text-gray-600">Ładowanie...</div>

    <table v-else class="min-w-full table-auto border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">ID</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">ID stacji</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Nazwa stacji</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Rodzaj paliwa</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Nowa cena</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">ID użytkownika</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Status</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Data utworzenia</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600"></th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proposal in proposals" :key="proposal.id" class="border-b">
          <td class="px-4 py-2 text-sm text-gray-600">{{ proposal.id }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ proposal.station_id }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ proposal.stationName }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ getFuelType(proposal.fuelType) }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ proposal.newPrice }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ proposal.user_id }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ proposal.status }}</td>
          <DateDisplay :dateString="proposal.created_at" class="px-4 py-2 text-sm text-gray-600">{{
            proposal.created_at
          }}</DateDisplay>
          <td class="px-4 py-2 text-sm text-gray-600">
            <button
              @click="updateProposalStatus(proposal, 'approved')"
              class="inline px-1 py-1 bg-primary text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
            >
              Zaakceptuj
            </button>
          </td>
          <td class="px-4 py-2 text-sm text-gray-600">
            <button
              @click="updateProposalStatus(proposal, 'rejected')"
              class="inline px-1 py-1 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
            >
              Odrzuć
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- 
getProposals
tabelka z:
- id
- typ paliwa
- proponowana cena
- status
-przycisk "szczegóły" -> otwiera modal w którym wyświetla getProposalDetails
-->
