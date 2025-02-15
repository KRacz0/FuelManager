<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/http'
import DateDisplay from '@/components/DateDisplay.vue'
import type User from '@/models/User'
import UserStatisticsModal from '@/components/UserStatisticsModal.vue'
import type Statistics from '@/models/Statistics'

const users = ref<User[]>([])
const loading = ref(true)
const modalUser = ref<User | null>(null)
const modalStatistics = ref<Statistics | null>(null)
const isUserStatisticsModalVisible = ref(false)

onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  try {
    const response = await http.get('/api/admin/users')
    users.value = response.data
  } catch (error) {
    console.error('Błąd pobierania danych:', error)
  } finally {
    loading.value = false
  }
}

async function banUser(user: User) {
  const response = await http.patch(`/api/admin/users/${user.id}/ban`)
  if (response.statusText == 'OK') {
    await loadUsers()
  }
}

async function showUserStatisticsModal(user: User){
  isUserStatisticsModalVisible.value = true
  modalUser.value = user
  const response = await http.get<Statistics>(`api/admin/users/${user!.id}/stats`)
  modalStatistics.value = response.data
}

// function getFuelType(fuel_type: string) {
//   if (fuel_type == 'fuel_gasoline') {
//     return 'PB'
//   }
//   if (fuel_type == 'fuel_diesel') {
//     return 'ON'
//   }
//   if (fuel_type == 'fuel_lpg') {
//     return 'LPG'
//   }
// }

// async function showFuelProposalDetailsModal(proposal: FuelProposal) {
//   isFuelProposalDetailsModalVisible.value = true
//   modalProposal.value = proposal
//   try {
//     const response = await http.get<Blob>(`/uploads/${proposal?.image_path}`, {
//       responseType: 'blob',
//     })
//     const imageBlob = response.data
//     modalImageURL.value = URL.createObjectURL(imageBlob)
//   } catch {
//     modalImageURL.value = null
//   }
// }
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-semibold text-center mb-6">Lista propozycji</h1>

    <div v-if="loading" class="text-center text-gray-600">Ładowanie...</div>

    <table v-else class="min-w-full table-auto border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">ID</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Email</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Rola</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Status</th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600">Data utworzenia użytkownika</th>
          <!-- <th class="px-4 py-2 text-sm font-semibold text-gray-600">Punkty</th> -->
          <th class="px-4 py-2 text-sm font-semibold text-gray-600"></th>
          <th class="px-4 py-2 text-sm font-semibold text-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-b">
          <td class="px-4 py-2 text-sm text-gray-600">{{ user.id }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ user.email }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ user.role }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ user.is_banned }}</td>
          <DateDisplay :dateString="user.created_at" class="px-4 py-2 text-sm text-gray-600">{{
            user.created_at
          }}</DateDisplay>
          <!-- <td class="px-4 py-2 text-sm text-gray-600">{{ user.points ?? 0 }}</td> -->
          <td v-if="user.is_banned == 1" class="px-4 py-2 text-sm text-gray-600">
            Użytkownik został zbanowany
          </td>
          <td v-else-if="user.role == 'admin'" class="px-4 py-2 text-sm text-gray-600"></td>
          <td v-else class="px-4 py-2 text-sm text-gray-600">
            <button
              @click="banUser(user)"
              class="inline px-1 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
            >
              Zbanuj użytkownika
            </button>
          </td>
          <td class="px-4 py-2 text-sm text-gray-600">
            <button
            v-if="user.role != 'admin'"
              @click="showUserStatisticsModal(user)"
              class="inline px-1 py-1 bg-primary text-white font-semibold rounded-lg hover:bg-green-500 transition duration-200"
            >
              Statystyki
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <UserStatisticsModal
      :isVisible="isUserStatisticsModalVisible"
      :user="modalUser"
      :statistics="modalStatistics"
      @close="isUserStatisticsModalVisible = false"
    />
</template>
