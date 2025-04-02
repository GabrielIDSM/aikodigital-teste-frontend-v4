<template>
  <section class="BoasVindas">
    <div class="Conteudo">
      <Logo />
      <p>
        O <span>Tree Metrics</span> é a plataforma centralizada para acompanhamento de equipamentos
        em campo, desenvolvida para fornecer visibilidade completa sobre as operações florestais.
        Para iniciar sua análise, selecione um dispositivo no mapa abaixo.
      </p>
    </div>
  </section>
</template>

<style scoped>
.BoasVindas {
  padding: 40px 0;
  color: rgba(var(--van-dyke), 1);
  text-align: center;
}

.Conteudo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

p {
  margin: 0;
  margin-bottom: 10px;
  font-size: 20px;
  line-height: 27px;
}

span {
  font-weight: 700;
}
</style>

<script setup lang="ts">
import Logo from './icons/Logo.vue'
</script>
