import express from 'express';

const app = express();
const port = 3000;

app.get('/', (_, res) => {
  res.send('Hello from backend!');
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
