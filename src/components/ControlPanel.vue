<template>
  <p class="hangul-number">Hangul #{{ currentHangul + 1 }}</p>
  <div class="no-select button-6"
  :class="[!hangul.voiceReady ? 'btn-disabled' : '',hangul.voiceError ? 'invalid' : '']"
  @click="playAudio">
      <span>Listen</span>
      <img src="../assets/listen.svg"/>
  </div>
  <div class="panel">
    <button class="no-select button-6"
    :class="[currentHangul === 0 ? 'btn-disabled' : '']"
    @click="prevHangul">
      <img src="../assets/prev.svg"/>
      <span>Prev</span>
    </button>
    <div class="response">
      <div class="hangul">
        <div class="hangul-text question-mark" @click="reveal" v-if="hidden">
          <p class="no-select">?</p>
        </div>
        <div class="hangul-text" v-else>
          <p>{{ hangul.text }}</p>
        </div>
      </div>
      <p class="transcript" :style="setHidden">
        {{ hangul.transcript }}
      </p>
    </div>
    <button ref="nextButton" class="no-select button-6" @click="nextHangul">
      <span>Next</span>
      <img src="../assets/next.svg"/>
    </button>
  </div>
  <div class="input-div">
    <input type="text" ref="inputTranscript" v-model="userInput"
    @keypress="inputKeyPressed" :disabled="!this.hidden"/>
    <button class="button-6 button-ok"
    :class="[!hidden ? 'btn-disabled' : '']"
    @click="checkInput">
      <img src="../assets/arrow-right.svg"/>
    </button>
  </div>
  <div class="pachim-freq">
    <span>Pachim frequency</span>
    <input v-model="pachimFreq" type="range" min="0" max="100"/>
  </div>

  <audio ref="correctAnswerAudio">
    <source src="../assets/bell.mp3" type="audio/mpeg">
  </audio>
</template>

<script>
import axios from 'axios';
import getRandomHangul from '../getHangul';

const bufferLen = parseInt(process.env.VUE_APP_HANGUL_BUFFER_LEN, 10);

export default {
  name: 'ControlPanel',
  data: () => ({
    hanguls: [],
    userInput: '',
    currentHangul: 0,
    pachimFreq: 0,
  }),
  async mounted() {
    if (bufferLen === undefined) {
      console.error('Missing environement variable VUE_APP_HANGUL_BUFFER_LEN');
    }
    this.fillHanguls();
  },
  computed: {
    hangul() {
      if (this.hanguls.length === 0) {
        return {
          text: '',
          transcript: '',
          voice: undefined,
          voiceReady: false,
          voiceError: false,
          hidden: true,
        };
      }
      return this.hanguls[this.currentHangul];
    },
    hidden() {
      return this.hangul.hidden;
    },
    setHidden() {
      const visibility = this.hidden ? 'hidden' : '';
      return { visibility };
    },
  },
  methods: {
    reveal() {
      this.hangul.hidden = false;
      this.$refs.inputTranscript.classList.remove('invalid');
      this.$refs.nextButton.focus();
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
    async getVoice(hangulText, index) {
      try {
        const voiceData = (await this.getAudio(hangulText)).data;
        this.hanguls[index].voiceReady = true;
        return new Blob(
          [voiceData],
          { type: 'audio/mpeg' },
        );
      } catch (err) {
        this.hanguls[index].voiceError = true;
        return null;
      }
    },
    createHangul(index) {
      const { text, transcript } = getRandomHangul(this.pachimFreq);
      this.hanguls[index] = {
        text,
        transcript,
        voice: null,
        voiceReady: false,
        voiceError: false,
        hidden: true,
      };
      this.hanguls[index].voice = this.getVoice(text, index);
    },
    fillHanguls() {
      const targetLength = this.hanguls.length + bufferLen;
      for (let i = this.hanguls.length; i < targetLength; i += 1) {
        this.createHangul(i);
      }
    },
    resetInput() {
      this.userInput = '';
      this.$refs.inputTranscript.classList.remove('invalid');
    },
    prevHangul() {
      this.currentHangul -= 1;
      this.resetInput();
      this.playAudio();
    },
    nextHangul() {
      this.currentHangul += 1;
      this.resetInput();

      if (this.hanguls.length < this.currentHangul + bufferLen) {
        this.fillHanguls();
      }
      this.playAudio();
    },
    async playAudio() {
      if (this.hangul.voiceReady) {
        const voice = await this.hangul.voice;
        const audio = new Audio(URL.createObjectURL(voice));
        audio.play();
      }
    },
    inputKeyPressed(evt) {
      if (evt.keyCode === 13) {
        this.checkInput();
      }
    },
    checkInput() {
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
  align-items: flex-start;
  margin-top: 0.7em;

  > .button-6 {
    margin-top: 2.5em;
  }
}

.response {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hangul {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.4);
  font-size: 90px;
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
    cursor: pointer;
    p {
      padding-top: 0.35em;
    }
  }

  .question-mark:hover {
    border-color: rgba(0, 0, 0, 0.5);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }

  .question-mark:active {
    background-color: #F0F0F1;
    border-color: rgba(0, 0, 0, 0.5);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }
}

.transcript {
  margin-top: 0.3em;
  font-size: 40px;
}

.hangul-number {
  font-size: 20px;
  margin-bottom: 0.8em;
}

.invalid {
  border: 3px solid rgb(158, 0, 0) !important;
}

.input-div {
  display: flex;
  justify-content: center;
  margin-top: 0.2em;

  input {
    font-size: 20px;
    max-width: 10em;
  }

  .button-ok {
    margin-top: 0;
    min-height: fit-content;
    padding: 0.2em;
  }
}

.pachim-freq {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 0.3em;
  margin-top: 1em;

  input {
    max-width: 9em;
  }
}

.button-6 {
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 20px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
  gap: 0.3em;
}

.button-6:hover,
.button-6:focus {
  border-color: rgba(0, 0, 0, 0.35);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.button-6:hover {
  transform: translateY(-1px);
}

.button-6:active {
  background-color: #F0F0F1;
  border-color: rgba(0, 0, 0, 0.35);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}

.btn-disabled {
  pointer-events: none;
  border: 1px solid rgba(153, 153, 153, 0.3);
  background-color: rgba(204, 204, 204, 0.4);
  color: rgba(102, 102, 102, 0.4);

  img {
    opacity: 0.4;
  }
}

@media screen and (max-width:500px) {
  .hangul {
    font-size: 60px;
  }

  .transcript {
    font-size: 30px;
  }

  .button-6 {
    font-size: 14px;
  }
}

</style>
