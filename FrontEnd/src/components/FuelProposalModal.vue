<script setup lang="ts">
import ModalBase from '@/components/ModalBase.vue'
import http from '@/http'
import type Station from '@/models/Station'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const props = defineProps<{
  isVisible: boolean
  station: Station | null
}>()

const file = ref<File | null>(null)

const fileUploaded = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (target && target.files) {
    const imageFile = target.files[0]
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']
    if (!validTypes.includes(imageFile.type)) {
      useToast().warning('Dozwolone rozszerzenia to .png, .jpg, .jpeg, .bmp')
      target.value = ''
      return
    }
    file.value = target.files[0]
  }
}

function sendProposal(fuelType: string, newPrice: number) {
  if (!file.value) {
    useToast().warning('Nie wybrano pliku')
    return
  }
  const formData = new FormData()
  formData.append('stationId', props.station!.id.toString())
  formData.append('fuelType', fuelType.toString())
  formData.append('newPrice', newPrice.toString())
  formData.append('image', file.value)
  http.post('api/stations/propose-change', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Optional, usually set automatically
    },
  })
}
</script>

<template>
  <ModalBase @close="$emit('close')" :isVisible="isVisible">
    <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-semibold text-center mb-6">Zaproponuj zmianę cen na stacji</h1>

      <!-- Informacje o stacji -->
      <div class="mb-6">
        <!-- <h2 class="text-lg font-semibold text-gray-800">Informacje o stacji</h2> -->
        <p class="text-gray-600">
          Nazwa stacji: <span class="font-medium text-blue-600">{{ station!.name }}</span>
        </p>
        <p class="text-gray-600">
          Lokalizacja: <span class="font-medium text-blue-600">{{ station!.address }}</span>
        </p>
      </div>

      <!-- Zmiana cen paliw -->
      <form @submit.prevent="">
        <div class="mb-4">
          <label for="fuel_gasoline" class="block text-sm font-medium text-gray-700">Cena PB</label>
          <input
            id="fuel_gasoline"
            type="number"
            v-model="station!.fuel_gasoline"
            class="mt-1 inline w-50 px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Wprowadź cenę za PB"
            required
            step="0.01"
          />
          <button
            @click="sendProposal('fuel_gasoline', station!.fuel_gasoline)"
            class="inline w-50 ml-10 px-1 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Zaktualizuj cenę
          </button>
        </div>

        <div class="mb-4">
          <label for="fuel_diesel" class="block text-sm font-medium text-gray-700"
            >Cena Diesel</label
          >
          <input
            id="fuel_diesel"
            type="number"
            v-model="station!.fuel_diesel"
            class="mt-1 inline w-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Wprowadź cenę za Diesel"
            required
            step="0.01"
          />
          <button
            @click="sendProposal('fuel_diesel', station!.fuel_diesel)"
            class="inline w-50 ml-10 px-1 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Zaktualizuj cenę
          </button>
        </div>

        <div class="mb-4">
          <label for="fuel_lpg" class="block text-sm font-medium text-gray-700">Cena LPG</label>
          <input
            id="fuel_lpg"
            type="number"
            v-model="station!.fuel_lpg"
            class="mt-1 inline w-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Wprowadź cenę za LPG"
            required
            step="0.01"
          />
          <button
            @click="sendProposal('fuel_lpg', station!.fuel_lpg)"
            class="inline w-50 ml-10 px-1 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Zaktualizuj cenę
          </button>
        </div>
        <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-2"
          >Wgraj zdjęcie potwierdzające ceny:</label
        >
        <input
          id="fileUpload"
          type="file"
          accept=".png,.jpg,.jpeg,.bmp"
          @change="fileUploaded"
          required
        />
        <!-- Przycisk Zatwierdź -->
        <!-- <div class="flex justify-center">
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Zatwierdź zmianę
          </button>
        </div> -->
      </form>
    </div>
  </ModalBase>
</template>

<!-- 
Informacje o konkretnej stacji,
zmiana cen dla fuel_gasoline,
zmiana cen dla fuel_diesel, 
zmiana cen dla fuel_lpg,
przycisk zatwierdź
 -->

<!-- swiąć z api -->
