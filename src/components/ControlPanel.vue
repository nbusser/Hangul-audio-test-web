<template>
  <div class="panel">
    <button @click="playAudio">Listen</button>
    <div class="response">
      <div class="hangul">
        <div class="hangul-text question-mark" @click="reveal" v-if="hidden">
          <p>?</p>
        </div>
        <div class="hangul-text" v-else>
          <p>{{ hangul.text }}</p>
        </div>
      </div>
      <p class="transcript" :style="setHidden">
        {{ hangul.transcript }}
      </p>
    </div>
    <button @click="nextHangul">Next</button>
  </div>
  <input type="text" ref="inputTranscript" v-model="userInput"
  @keypress="checkInput" :disabled="!this.hidden"/>

  <audio ref="correctAnswerAudio">
    <source src="../assets/bell.mp3" type="audio/mpeg">
  </audio>
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
    userInput: '',
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
      this.$refs.inputTranscript.classList.remove('invalid');
      this.playAudio();
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
      this.userInput = '';
      this.$refs.inputTranscript.classList.remove('invalid');
      this.fillHanguls();
      this.playAudio();
    },
    async playAudio() {
      const voice = await this.hangul.voice;
      const audio = new Audio(URL.createObjectURL(voice));
      audio.play();
    },
    checkInput(evt) {
      if (evt.keyCode !== 13) {
        return;
      }
      const input = this.$refs.inputTranscript;
      if (this.userInput === this.hangul.transcript) {
        input.classList.remove('invalid');
        this.$refs.correctAnswerAudio.play();
        this.reveal();
      } else {
        input.classList.add('invalid');
      }
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

.response {
  text-align: center;
}

.hangul {
  position: relative;
  border: 1px solid black;
  font-size: 60px;
  width: 2em;
  height: 1.7em;

  p {
    display: inline-block;
    vertical-align: sub;
  }

  .hangul-text {
    height: 100%;
  }

  .question-mark {
    p {
      padding-top: 0.35em;

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }

  .question-mark:hover {
    background-color: beige;
  }

  .question-mark:active {
    background-color: rgb(240, 240, 167);
  }
}

.transcript {
  margin-top: 0.2em;
  font-size: 30px;
}

.invalid {
  border: 1px solid rgb(158, 0, 0);
}

input {
  width: 9em;
  margin-left: 0.5em;
}

</style>
