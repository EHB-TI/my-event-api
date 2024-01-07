const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hallo Wereld!');
});

app.listen(port, () => {
  console.log(`Server luistert op poort ${port}`);
});
