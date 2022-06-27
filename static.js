import express from 'express';
// const express = require('express');
const app = express();
const port = 9000;

const users = [
  {
    fname: 'govind',
    lname: 'bisen',
    email: 'gb@gmail.com',
    password: 'gb@1234',
    mobile: '9999119999',
    address: ' 181919 jabalpur mp',
    id: 1,
  },
  {
    fname: 'jenifer',
    lname: 'richter',
    email: 'jn@gmail.com',
    password: 'jn@1234',
    mobile: '8888888888',
    address: 'home santa cruize germany 1819',
    id: 2,
  },
  {
    fname: '',
    lname: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    id: 3,
  },
];

app.get('/', (request, response) => {
  response.send('Hello world !!');
});

app.get('/users', (request, response) => {
  const { lname, fname, email, mobile } = request.query;
  let filteredUser = users;
  console.log(lname, email, fname, mobile);
  if (lname) {
    filteredUser = filteredUser.filter((u) => u.lname === lname);
  }
  if (fname) {
    filteredUser = filteredUser.filter((u) => u.fname === fname);
  }
  if (email) {
    filteredUser = filteredUser.filter((u) => u.email === email);
  }
  if (mobile) {
    filteredUser = filteredUser.filter((u) => u.mobile === mobile);
  }
  response.send(filteredUser);
});

app.get('/user/:id', (request, response) => {
  console.log(request.params.id);
  const { id } = request.params;
  const user = users.find((u) => u.id == id);
  user
    ? response.send(user)
    : response.status(404).send({ msg: 'no user found!!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
