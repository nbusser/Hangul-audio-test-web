<template>
  <h1>Hangul listening test</h1>
  <div class="control-panel">
    <ControlPanel/>
  </div>
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

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.control-panel {
  margin-top: 2em;
  display : inline-block;
  text-align: center;
}

</style>
