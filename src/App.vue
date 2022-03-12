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
import axios from 'axios';

export default {
  name: 'App',
  data: () => ({
    hangul: null,
    transcript: null,
    audio: null,
    hidden: true,
  }),
  async mounted() {
    this.nextHangul();
  },
  methods: {
    reveal() {
      this.hidden = false;
    },
    async nextHangul() {
      const { hangul, transcript } = await this.apiGet('hangul', {});
      this.hangul = hangul;
      this.transcript = transcript;
      this.hidden = true;
    },
    async apiGet(endpoint, payload) {
      try {
        return (await axios.get(`/api/${endpoint}`, payload)).data;
      } catch (err) {
        console.error(err);
        throw err;
      }
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
