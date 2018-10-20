const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/temperature', (req, res) => {
  res.send({ temperature: 39.5 });
});

app.listen(port, () => console.log(`Backend listening on port ${port}`));