import express from 'express';
const router = express.Router();

router.get('/about', (req, res) => {
  res.send('testing routes');
});

router.post('/', async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client
    .db('axionics')
    .collection('users')
    .insertMany(data);
  response.send(result);
});

router.get('/', async (request, response) => {
  // const { lname, fname, email, mobile } = request.query;
  const filter = request.query;
  console.log(filter);
  let filteredUser = await client
    .db('axionics')
    .collection('users')
    .find(filter)
    .toArray();
  // console.log(filteredUser);
  const page = request.query.page;
  const limit = request.query.limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultUser = filteredUser.slice(startIndex, endIndex);
  if (page && limit) {
    if (resultUser) {
      response.send(resultUser);
    }
  } else {
    response.send(filteredUser);
  }
});

router.get('/:id', async (request, response) => {
  console.log(request.params.id);
  const { id } = request.params;
  const user = await client
    .db('axionics')
    .collection('users')
    .findOne({ id: +id });
  console.log(user);
  user
    ? response.send(user)
    : response.status(404).send({ msg: 'no user found!!' });
});

router.delete('/:id', async (request, response) => {
  // console.log(request.params.id);
  const { id } = request.params;
  const result = await client
    .db('axionics')
    .collection('users')
    .deleteMany({ id: +id });
  //deleteOne({id:+id}) for one

  console.log(result);

  result.deletedCount > 0
    ? response.send(user)
    : response.status(404).send({ msg: 'no match found!!' });
});

router.put('/id', async (request, response) => {
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db('axionics')
    .collection('users')
    .updateOne({ id: id }, { set: data });
  const user = await client
    .db('axionics')
    .collection('users')
    .findOne({ id: +id });
  response.send(user);
});

export const userRouter = router;
// module.exports = router;
