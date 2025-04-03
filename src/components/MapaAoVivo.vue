<template>
  <section>
    <div>
      <div id="mapa"></div>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 40px 0;
  color: rgba(var(--van-dyke), 1);
  background-color: rgba(var(--cinereous), 0.2);
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

#mapa {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  border: solid 2px rgba(var(--cinereous), 0.5);
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEquipamentoStore } from '@/stores/equipamento'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { map } from 'leaflet'
import type { Posicao, RegistroEstado } from '@/types/Equipamento'
import { Icons } from './icons/Icons'

const equipamentoStore = useEquipamentoStore()

onMounted(() => {
  const mapa = map('mapa', {
    zoom: 11,
    center: [-19.1, -46.0],
  })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapa)

  equipamentoStore.equipamentos.forEach((e) => {
    const ultimoStatus: RegistroEstado = e.registros[e.registros.length - 1]
    const ultimaPosicao: Posicao = e.posicoes[e.posicoes.length - 1]

    let svg
    switch (e.modelo.nome) {
      case 'Caminhão de carga':
        svg = Icons['Caminhão de carga']
        break
      case 'Harvester':
        svg = Icons['Harvester']
        break
      case 'Garra traçadora':
        svg = Icons['Garra traçadora']
        break
    }

    const div = document.createElement('div')
    div.style.setProperty('--cor', ultimoStatus.estado.cor)
    div.innerHTML = `
      ${svg}
      <p class="Nome">${e.nome}</p>
      <p class="Modelo">${e.modelo.nome}</p>
    `

    let customIcon = L.divIcon({
      className: 'Marcador',
      html: div,
      iconSize: [130, 80],
      iconAnchor: [130, 80],
    })

    L.marker([ultimaPosicao.latitude, ultimaPosicao.longitude], { icon: customIcon }).addTo(mapa)
  })
})
</script>
