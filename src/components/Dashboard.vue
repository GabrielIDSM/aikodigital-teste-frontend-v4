<template></template>

<style scoped></style>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Equipamento } from '@/types/Equipamento'

const props = defineProps({
  equipamento: {
    type: Object as PropType<Equipamento>,
    required: true,
  },
})
</script>
