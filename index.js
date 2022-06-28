import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import { userRouter } from './routes/users.js';

import dotenv from 'dotenv';
dotenv.config();

// console.log(process.env);
// const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

console.log(process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log('MongoDb connected!!');
  return client;
}

export const client = await createConnection();

app.get('/', (request, response) => {
  response.send('Hello world !!');
});

app.use('/users', userRouter);

async function genPassword(password) {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  // console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  // console.log(hashedPassword);
  return hashedPassword;
}
// genPassword('password@1234');

app.post('/signup', async (request, response) => {
  const { username, fname, lname, email, password, mobile, address } =
    request.body;

  const hashedPassword = await genPassword(password);
  const changedData = {
    username,
    fname,
    lname,
    email,
    password: hashedPassword,
    mobile,
    address,
  };

  const usernameInDB = await client
    .db('aexonic')
    .collection('users')
    .findOne({ username: username });

  if (usernameInDB) {
    response.send({ message: 'usrname already exists!!' });
    return;
  }

  if (password.length < 7) {
    response.send({ message: 'Password should be longer' });
    return;
  }
  //TODO regex for password validation, password length , reusable function

  const result = await client
    .db('aexonic')
    .collection('users')
    .insertOne(changedData);
  response.send(result);
});

app.post('/login', async (request, response) => {
  const { username, password } = request.body;
  console.log(username, password);
  const userFromDB = await client
    .db('aexonic')
    .collection('users')
    .findOne({ username: username });

  if (!userFromDB) {
    response.status(400).send({ message: 'Invalid credentials ' });
    return;
  }

  const storedPassword = userFromDB.password;

  const isPasswordMatch = await bcrypt.compare(password, storedPassword);

  if (isPasswordMatch) {
    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
    response.send({ msg: 'success ful login', token: token });
  } else {
    response.status(401).send({ msg: 'Invalid credential' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//if using mongoDB id use
//findOne(_id: ObjectId(id))
