<script setup lang="ts">
const props = defineProps<{
  isVisible: boolean
}>()
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <header class="flex justify-between items-center p-4 border-b">
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">&times;</button>
      </header>
      <div class="p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
