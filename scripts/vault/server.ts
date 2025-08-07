import express, { Request, Response } from 'express';
const app = express();

app.get('/', (_: Request, res: Response) => {
  res.send('Vault server is alive');
});

app.listen(3001, () => {
  console.log('Vault server running on port 3001');
});