<script setup lang="ts">
//dzień, miesiąc, rok, godzina, minuta
const props = defineProps<{
  dateString: string
}>()
// const date = new Date('2025-01-03T08:03:05.000Z')
const date = new Date(props.dateString)

const hours = CleanUp(date.getHours())
const minutes = CleanUp(date.getMinutes())
const day = CleanUp(date.getDate())
const month = CleanUp(date.getMonth() + 1)
const year = date.getFullYear()

function CleanUp(value: number) {
  if (value < 10) {
    return '0' + value
  }
  return value
}
</script>

<template>
  <div class="text-blue-400">{{ hours }}:{{ minutes }}&nbsp;{{ day }}.{{ month }}.{{ year }}</div>
</template>
