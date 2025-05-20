<template>
  <div>
    <div class="card flex">
      <Pie ref="pieRef" />
      <Pie ref="pieRef" />
      <Pie ref="pieRef" />
      <Pie ref="pieRef" />
      <Pie ref="pieRef" />
    </div>
    <div class="card"></div>
    <div class="card"></div>
  </div>
</template>

<script setup lang="ts" name="home">
import Pie from "../components/pie.vue";
</script>

<style scoped lang="scss"></style>
