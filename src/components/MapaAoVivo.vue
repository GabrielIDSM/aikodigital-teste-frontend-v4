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

<script setup>
import { ref, onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

const initialMap = ref(null)

onMounted(() => {
  initialMap.value = L.map('mapa').setView([23.8041, 90.4152], 6)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(initialMap.value)
})
</script>
