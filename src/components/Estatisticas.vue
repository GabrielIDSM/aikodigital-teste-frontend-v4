<template>
  <div class="Resumo">
    <p>
      O {{ props.equipamento.modelo.nome.toLocaleLowerCase('pt-BR') }}
      {{ props.equipamento.nome }} ficou disponível por
      <span>{{ horasPorStatus['Operando'] }} horas</span>, equivalente a
      <span
        >{{
          (
            (horasPorStatus['Operando'] /
              (horasPorStatus['Operando'] +
                horasPorStatus['Parado'] +
                horasPorStatus['Manutenção'])) *
            100
          ).toFixed(2)
        }}%</span
      >
      do tempo total, registrando um ganho de
      <span>{{
        ganhosPorStatus['Operando'] - (ganhosPorStatus['Parado'] + ganhosPorStatus['Manutenção'])
      }}</span
      >.
    </p>
  </div>
  <div class="Container">
    <div class="Doughnut">
      <DoughnutChart :chartData="chartDataDoughnut" :options="chartOptionsDoughnut" />
    </div>
    <div class="Bar">
      <BarChart :chartData="chartDataBar" :options="chartOptionsBar" />
    </div>
  </div>
</template>

<style scoped>
.Container {
  display: flex;
  gap: 10px;
}

.Resumo {
  margin: 0;
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(var(--van-dyke), 1);
  text-align: center;
}

.Resumo span {
  font-weight: 500;
}

.Doughnut,
.Bar {
  flex: 1;
}

@media (max-width: 980px) {
  .Container {
    flex-direction: column;
  }
}
</style>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import type { Equipamento, GanhosPorStatus, HorasPorStatus } from '@/types/Equipamento'
import { useCorStore } from '@/stores/cor'
import { DoughnutChart, BarChart } from 'vue-chart-3'
import { Chart, registerables, type ChartData } from 'chart.js'
import { DateTime } from 'luxon'

Chart.register(...registerables)

const props = defineProps({
  equipamento: {
    type: Object as PropType<Equipamento>,
    required: true,
  },
})

const corStore = useCorStore()

const horasPorStatus = computed(() => {
  const horasPorStatus: HorasPorStatus = {}

  for (let i = 1; i < props.equipamento.registros.length; i++) {
    const registroAnterior = props.equipamento.registros[i - 1]
    const registroAtual = props.equipamento.registros[i]
    const inicio = DateTime.fromJSDate(registroAnterior.data)
    const fim = DateTime.fromJSDate(registroAtual.data)
    const duracao = fim.diff(inicio, 'hours').hours

    if (!horasPorStatus[registroAnterior.estado.nome]) {
      horasPorStatus[registroAnterior.estado.nome] = 0
    }

    horasPorStatus[registroAnterior.estado.nome] += duracao
  }

  return horasPorStatus
})

const ganhosPorStatus = computed(() => {
  const ganhosPorStatus: GanhosPorStatus = {
    Operando: 0,
    Parado: 0,
    Manutenção: 0,
  }

  Object.keys(horasPorStatus.value).forEach((hs) => {
    const horas = horasPorStatus.value[hs]
    const ganhoPorHora = props.equipamento.modelo.ganhos.find((f) => f.estado.nome == hs)!.valor
    ganhosPorStatus[hs] = horas * ganhoPorHora
  })

  return ganhosPorStatus
})

const chartDataDoughnut = computed<ChartData<'doughnut', number[], string>>(() => ({
  labels: Object.keys(horasPorStatus.value),
  datasets: [
    {
      data: Object.values(horasPorStatus.value),
      backgroundColor: Object.keys(horasPorStatus.value).map((k) => corStore.obterCorPorStatus(k)),
      borderRadius: 8,
    },
  ],
}))

const chartOptionsDoughnut = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Disponibilidade',
      font: {
        size: 16,
      },
      color: '#3F292C',
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value}h (${percentage}%)`
        },
      },
    },
  },
  cutout: '70%',
  animation: {
    animateScale: true,
    animateRotate: true,
  },
})

const chartDataBar = computed<ChartData<'bar', number[], string>>(() => ({
  labels: Object.keys(ganhosPorStatus.value),
  datasets: [
    {
      data: Object.values(ganhosPorStatus.value),
      backgroundColor: Object.keys(ganhosPorStatus.value).map((k) => corStore.obterCorPorStatus(k)),
      borderRadius: 8,
    },
  ],
}))

const chartOptionsBar = ref({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Ganho por status',
      font: { size: 16 },
      color: '#3F292C',
    },
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Ganho',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Status',
      },
    },
  },
  animation: {
    animateScale: true,
    animateRotate: true,
  },
})
</script>
