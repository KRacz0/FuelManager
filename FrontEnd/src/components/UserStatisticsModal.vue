<script setup lang="ts">
import type User from '@/models/User';
import ModalBase from './ModalBase.vue';
import type Statistics from '@/models/Statistics';

const props = defineProps<{
  isVisible: boolean
  user: User | null
  statistics: Statistics | null
}>()

</script>

<template>
    <ModalBase @close="$emit('close')" :isVisible="isVisible">
        <div>
            <div>Użytkownik: {{ user!.email }}</div>
            <div>Zaakceptowane propozycje: {{ statistics!.accepted_proposals }}</div>
            <div>Odrzucone propozycje: {{ statistics!.rejected_proposals }}</div>
        </div>
    </ModalBase>
</template>