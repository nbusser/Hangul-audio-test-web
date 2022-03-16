// https://gist.github.com/hyunjun/03eed685035a22fdaa26#file-hangul_phoneme-py
// https://github.com/bluedisk/hangul-toolkit/blob/f36b534ee339263fb72e687b732697cc7ed290dc/hgtk/letter.py

import Aromanize from 'aromanize';

const randInt = (min, max) => Math.floor(
  Math.random() * (max - min),
);

export default (jongsungFreq = 20) => {
  const nChosung = 19;
  const nJungsung = 21;
  const nJongsung = 28;

  const chosung = randInt(0, nChosung);
  const jungsung = randInt(0, nJungsung);
  const jongsung = Math.random() < jongsungFreq / 100 ? randInt(0, nJongsung) : 0;

  const text = String.fromCharCode(
    0xAC00 + chosung * (nJungsung * nJongsung) + jungsung * nJongsung + jongsung,
  );

  const transcript = Aromanize.romanize(text);
  return {
    text,
    transcript,
  };
};
