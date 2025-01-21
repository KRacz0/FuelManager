<script setup lang="ts">
import type FuelProposal from '@/models/FuelProposal'
import ModalBase from './ModalBase.vue'
import DateDisplay from './DateDisplay.vue'
import http from '@/http'
import { onMounted } from 'vue'

const emit = defineEmits(['refresh', 'close'])

const props = defineProps<{
  isVisible: boolean
  proposal: FuelProposal | null
  imageURL: string | null
}>()

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

async function updateProposalStatus(status: string) {
  const request = { status: status }
  const response = await http.patch(`/api/stations/proposals/${props.proposal?.id}/status`, request)
  if (response.statusText == 'OK') {
    emit('refresh')
    emit('close')
  }
}
</script>

<template>
  <ModalBase @close="$emit('close')" :isVisible="isVisible">
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-semibold text-center mb-6">Szczegóły</h1>

      <div class="space-y-4">
        <!-- Pętla przez propozycje -->

        <div class="grid grid-cols-4 gap-4">
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">ID<br /></span>
            <span class="text-sm text-gray-600">{{ proposal!.id }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">ID stacji<br /></span>
            <span class="text-sm text-gray-600">{{ proposal!.station_id }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">Nazwa stacji<br /></span>
            <span class="text-sm text-gray-600">{{ proposal!.stationName }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">Rodzaj paliwa<br /></span>
            <span class="text-sm text-gray-600">{{ getFuelType(proposal!.fuelType) }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">Nowa cena<br /></span>
            <span class="text-sm text-gray-600">{{ proposal!.newPrice }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">ID użytkownika<br /></span>
            <span class="text-sm text-gray-600">{{ proposal!.user_id }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">Status<br /></span>
            <span class="text-sm text-gray-600">{{ proposal!.status }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-sm font-semibold text-gray-600">Data utworzenia<br /></span>
            <span class="text-sm text-gray-600">
              <DateDisplay :dateString="proposal!.created_at" class="text-sm text-gray-600">
                {{ proposal!.created_at }}
              </DateDisplay>
            </span>
          </div>
        </div>
        <div class="space-y-1 text-center">
          <span class="text-sm font-semibold text-gray-600">Zdjęcie<br /></span>
          <img
            v-if="imageURL"
            :src="imageURL"
            alt="Pobrane zdjęcie"
            class="object-cover rounded-md mx-auto"
          />
        </div>

        <div class="mt-4">
          <button
            @click="updateProposalStatus('approved')"
            class="px-4 py-2 mr-4 bg-primary text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Zaakceptuj
          </button>
          <button
            @click="updateProposalStatus('rejected')"
            class="px-4 py-2 ml-4 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Odrzuć
          </button>
        </div>
      </div>
    </div>
  </ModalBase>
</template>
