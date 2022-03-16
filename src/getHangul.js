import Aromanize from 'aromanize';

const randInt = (min, max) => Math.floor(
  Math.random() * (max - min) + min,
);

export default (jongsungFreq = 0.5) => {
  const nChosung = 19;
  const nJungsung = 21;
  const nJongsung = 28;

  const chosung = randInt(0, nChosung);
  const jungsung = randInt(0, nJungsung);
  const jongsung = Math.random() < jongsungFreq ? randInt(0, nJongsung) : 0;

  const text = String.fromCharCode(
    0xAC00 + chosung * (nJungsung * nJongsung) + jungsung * nJongsung + jongsung,
  );
  const transcript = Aromanize.romanize(text);
  return {
    text,
    transcript,
  };
};
