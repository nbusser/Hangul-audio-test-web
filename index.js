const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const gtts = require('node-gtts')('ko');

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const publicAdminRoot = 'dist';
app.get('/', (_, res) => {
  res.sendFile('index.html', { root: publicAdminRoot });
});
app.use(express.static(publicAdminRoot));

const router = express.Router();
router.get('/audio', (req, res) => {
  const { hangul } = req.query;
  if (hangul === undefined) {
    console.error('Empty audio request');
    res.status(500).send();
    return;
  }
  try {
    res.set({ 'Content-Type': 'audio/mpeg' });
    gtts.stream(hangul).pipe(res);
  } catch (err) {
    console.error(err);
    res.set({ 'Content-Type': 'text' });
    res.status(500).send();
  }
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Hangul gTTS server listening on port ${port}`);
});
