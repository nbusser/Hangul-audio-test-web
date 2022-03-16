# Hangul listening test Web

Use this humble application to test your ability to recognize hanguls.

It will generate random hanguls for you and play an audio transcription of it. You then have to recognize the hangul and write the romanized transcription of it in the input field.

The application contains a node.js server and a Vue.js frontend.
The server interacts with Google Translate to get audio transcription of each hangul.

The application is [deployed on heroku](https://hangul-listening-test.herokuapp.com/).

## Install

```
npm install
```

Create a file named ``.env`` in root folder of the project.
Inside, write ``VUE_APP_HANGUL_BUFFER_LEN=X`` and replace X with an integer.
This environment variable determines the size of the buffer used by the application to prepare the following hanguls.

## Usage

```
npm run start
```

Then, [connect here](http://localhost:3333).
