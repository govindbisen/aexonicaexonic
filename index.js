import express from 'express';
import { MongoClient } from 'mongodb';
import { userRouter } from './routes/users.js';

import dotenv from 'dotenv';
dotenv.config();
// console.log(process.env);
// const express = require('express');
const app = express();
const port = process.env.PORT;

console.log(process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log('MongoDb connected!!');
  return client;
}

const client = await createConnection();

app.use(express.json());

app.get('/', (request, response) => {
  response.send('Hello world !!');
});

app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
