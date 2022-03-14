<template>
  <h1>Hangul audio test</h1>
  <ControlPanel/>
  <footer>
    MIT Licenced - https://github.com/nbusser/Hangul-audio-test-web
  </footer>
</template>

<script>
import ControlPanel from './components/ControlPanel.vue';

export default {
  name: 'App',
  components: {
    ControlPanel,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  footer {
    position: absolute;
    bottom: 0;
  }
}
</style>
