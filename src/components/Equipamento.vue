<template>
  <section>
    <div v-if="exibirDetalhes"></div>
  </section>
</template>

<style scoped>
section {
  padding: 40px 0;
  color: rgba(var(--van-dyke), 1);
  text-align: center;
}

section > div {
  margin: 0 auto;
  padding: 10px;
  max-width: 980px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>

<script setup lang="ts">
import { useEquipamentoStore } from '@/stores/equipamento'
import type { Equipamento } from '@/types/Equipamento'
import { computed } from 'vue'

const equipamentoStore = useEquipamentoStore()

const exibirDetalhes = computed(() => {
  const equipamento: Equipamento | undefined = equipamentoStore.equipamentos.find(
    (f) => f.exibirDetalhes,
  )

  return equipamento != undefined && equipamento.exibirDetalhes!
})
</script>
