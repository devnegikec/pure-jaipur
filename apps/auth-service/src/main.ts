import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './appError/ErrorMiddleware'

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use(errorMiddleware);

const server = app.listen(port, host, () => {
  console.log(`Auth service is running at http://${host}:${port}`);
});

server.on('error', (error: any) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
