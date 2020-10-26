<template>
  <navigator default-path="normal/button">
    <div class="app-home">
      <app-menu></app-menu>
      <navigator-page />
    </div>
  </navigator>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NavigatorPage } from 'playground/components/navigator/navigator-page';
import { Navigator } from 'playground/components/navigator/navigator';
import AppMenu from 'playground/components/menu';

export default defineComponent({
  name: 'App',
  components: {
    Navigator,
    NavigatorPage,
    AppMenu
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
