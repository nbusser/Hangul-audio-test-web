<template>
  <div class="panel">
    <button @click="playAudio">Listen</button>
    <div class="response">
      <div class="hangul">
        <p v-if="hidden" @click="reveal">
          ?
        </p>
        <p class="hangul" v-else>
          {{ hangul.text }}
        </p>
      </div>
      <p :style="setHidden">{{ hangul.transcript }}</p>
    </div>
    <button @click="nextHangul">Next</button>
  </div>
</template>

<script>
import axios from 'axios';
import getRandomHangul from '../getHangul';

const HANGUL_BUFFER_LEN = 3;

export default {
  name: 'ControlPanel',
  data: () => ({
    hanguls: [],
    hidden: true,
  }),
  async mounted() {
    this.fillHanguls();
  },
  computed: {
    hangul() {
      if (this.hanguls.length === 0) {
        return {
          text: '',
          transcript: '',
          audio: undefined,
        };
      }
      return this.hanguls[0];
    },
    setHidden() {
      const visibility = this.hidden ? 'hidden' : '';
      return { visibility };
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
      this.playAudio();
    },
    async playAudio() {
      const voice = await this.hangul.voice;
      const audio = new Audio(URL.createObjectURL(voice));
      audio.play();
    },
  },
};
</script>

<style lang="scss" scoped>

p {
  margin: 0;
}

.panel {
  display: flex;
  gap: 1em;
  align-items: center;
}

.hangul {
  font-size: 60px;
  width: 2em;
  height: 2em;
}

.response {
  text-align: center;
}
</style>
