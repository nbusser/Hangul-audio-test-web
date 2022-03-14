<template>
  <button @click="playAudio">Listen</button>
  <div class="hangul">
    <button v-if="hidden" @click="reveal">?</button>
    <button v-else>{{ hangul }}</button>
    <p v-if="!hidden">{{ transcript }}</p>
  </div>
  <button @click="nextHangul">Next</button>
</template>

<script>
import axios from 'axios';
import getRandomHangul from './getHangul';

export default {
  name: 'App',
  data: () => ({
    hangul: null,
    transcript: null,
    voices: null,
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
      const { hangul, transcript } = getRandomHangul();
      this.hangul = hangul;
      this.transcript = transcript;
      this.hidden = true;

      this.voice = (new Blob(
        [(await this.getAudio(this.hangul)).data],
        { type: 'audio/mpeg' },
      ));
    },
    async getAudio(hangul) {
      try {
        return await axios.get(
          '/api/audio',
          {
            params: { hangul },
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
          },
        );
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    playAudio() {
      const audio = new Audio(URL.createObjectURL(this.voice));
      audio.play();
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
