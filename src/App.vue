<template>
  <button>Listen</button>
  <div class="hangul">
    <button v-if="hidden" @click="reveal">?</button>
    <button v-else>{{ hangul }}</button>
    <p v-if="!hidden">{{ transcript }}</p>
  </div>
  <button @click="nextHangul">Next</button>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    hangul: null,
    transcript: null,
    audio: null,
    hidden: true,
  }),
  methods: {
    reveal() {
      this.hidden = false;
    },
    nextHangul() {
      // TODO: call API
      this.hidden = true;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.hangul {
  text-align: center;
}
</style>
