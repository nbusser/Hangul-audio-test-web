<template>
  <h1>Hangul listening test</h1>
  <p class="guideline">Enter what you hear</p>
  <div class="control-panel">
    <ControlPanel/>
  </div>
  <footer>
    MIT Licensed -
    <a title="Link to the project" target="_blank" href="https://github.com/nbusser/Hangul-audio-test-web">
      <img alt="Github icon" src="./assets/github.png"/>
    </a>
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
}

footer {
  opacity: 0.6;
  margin-top: 2em;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.3em;
  justify-content: center;
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

.guideline {
  font-size: 20px;
}

</style>
