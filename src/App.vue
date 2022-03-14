<template>
  <button @click="playAudio">Listen</button>
  <div class="hangul">
    <button v-if="hidden" @click="reveal">?</button>
    <button v-else>{{ hangul.text }}</button>
    <p v-if="!hidden">{{ hangul.transcript }}</p>
  </div>
  <button @click="nextHangul">Next</button>
</template>

<script>
import axios from 'axios';
import getRandomHangul from './getHangul';

const HANGUL_BUFFER_LEN = 3;

export default {
  name: 'App',
  data: () => ({
    hanguls: [],
    hidden: true,
  }),
  async mounted() {
    this.fillHanguls();
  },
  computed: {
    hangul() {
      return this.hanguls[0];
    },
  },
  methods: {
    reveal() {
      this.hidden = false;
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
    async getVoice(hangulText) {
      const voiceData = (await this.getAudio(hangulText)).data;
      return new Blob(
        [voiceData],
        { type: 'audio/mpeg' },
      );
    },
    createHangul() {
      const { hangul: text, transcript } = getRandomHangul();
      return {
        text,
        transcript,
        voice: this.getVoice(text),
      };
    },
    fillHanguls() {
      for (let i = this.hanguls.length; i < HANGUL_BUFFER_LEN; i += 1) {
        this.hanguls[i] = this.createHangul();
      }
    },
    async nextHangul() {
      this.hidden = true;
      this.hanguls.splice(0, 1);
      this.fillHanguls();
    },
    async playAudio() {
      const voice = await this.hangul.voice;
      const audio = new Audio(URL.createObjectURL(voice));
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
