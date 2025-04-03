import type {
  Equipamento,
  Estado,
  Ganho,
  Modelo,
  Posicao,
  RegistroEstado,
} from '@/types/Equipamento'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import equipment from '@/../data/equipment.json'
import equipmentModel from '@/../data/equipmentModel.json'
import equipmentPositionHistory from '@/../data/equipmentPositionHistory.json'
import equipmentState from '@/../data/equipmentState.json'
import equipmentStateHistory from '@/../data/equipmentStateHistory.json'

export const useEquipamentoStore = defineStore('equipamento', () => {
  const equipamentos = ref<Equipamento[]>([])

  const carregarEquipamentos = () => {
    equipment.forEach((e) => {
      let model = equipmentModel.find((f) => f.id == e.equipmentModelId)
      let ganhos: Ganho[] = []

      model!.hourlyEarnings.forEach((he) => {
        let state = equipmentState.find((f) => f.id == he.equipmentStateId)
        const estado: Estado = {
          nome: state!.name,
          cor: state!.color,
        }

        const ganho: Ganho = {
          estado: estado,
          valor: he.value,
        }

        ganhos.push(ganho)
      })

      const modelo: Modelo = {
        id: e.equipmentModelId,
        nome: model!.name,
        ganhos: ganhos,
      }

      let registros: RegistroEstado[] = []
      let stateHistory = equipmentStateHistory.find((f) => f.equipmentId == e.id)
      stateHistory!.states.forEach((sh) => {
        let state = equipmentState.find((f) => f.id == sh.equipmentStateId)
        const estado: Estado = {
          nome: state!.name,
          cor: state!.color,
        }

        const registro: RegistroEstado = {
          data: new Date(sh.date),
          estado: estado,
        }

        registros.push(registro)
      })

      let posicoes: Posicao[] = []
      let positionHistory = equipmentPositionHistory.find((f) => f.equipmentId == e.id)
      positionHistory!.positions.forEach((ph) => {
        const posicao: Posicao = {
          data: new Date(ph.date),
          latitude: ph.lat,
          longitude: ph.lon,
        }

        posicoes.push(posicao)
      })

      const equipamento: Equipamento = {
        id: e.id,
        nome: e.name,
        modelo: modelo,
        registros: registros,
        posicoes: posicoes,
      }

      equipamentos.value.push(equipamento)
    })
  }

  const exibirDetalhes = (nome: string) => {
    const equipamento: Equipamento = equipamentos.value.find((f) => f.nome == nome)!

    equipamentos.value.filter((f) => f.nome != nome).forEach((e) => (e.exibirDetalhes = false))
    equipamento.exibirDetalhes = !equipamento.exibirDetalhes
  }

  const ocultarDetalhes = (nome: string) => {
    equipamentos.value.find((f) => f.nome == nome)!.exibirDetalhes = false
  }

  carregarEquipamentos()

  return { equipamentos, exibirDetalhes, ocultarDetalhes }
})
