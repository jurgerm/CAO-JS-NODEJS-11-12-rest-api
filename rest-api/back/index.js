const express = require('express');

const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGODB_URI);

app.get('/', (req, res) => {
  res.send({ msg: 'success' });
});

app.get('/rest-api/memberships', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('rest-api')
      .collection('memberships')
      .find()
      .toArray();
    await con.close();
    return res.send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// removes memberships by ID
app.delete('/rest-api/memberships/:id', async (req, res) => {
  try {
    const con = await client.connect();
    const membershipsCollection = await con
      .db('rest-api')
      .collection('memberships');

    const { id } = req.params;

    await membershipsCollection.deleteOne({
      _id: ObjectId(id),
    });

    await con.close();

    return res.send({
      deletedmembershipId: id,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.delete('/rest-api/users/:id', async (req, res) => {
  try {
    const con = await client.connect();
    const usersCollection = await con
      .db('rest-api')
      .collection('users');

    const { id } = req.params;

    await usersCollection.deleteOne({
      _id: ObjectId(id),
    });

    await con.close();

    return res.send({
      deletedmembershipId: id,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/rest-api/users', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('rest-api')
      .collection('users')
      .find()
      .toArray();
    await con.close();
    return res.send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/rest-api/users', async (req, res) => {
  try {
    const con = await client.connect();

    const pipeline = [
      {
        $lookup: {
          from: 'memberships',
          localField: 'membership_id',
          foreignField: '_id',
          as: 'membership',
        },
      },
      //  rikiuoju ne pagal vardą

    ];

    const data = await con
      .db('rest-api')
      .collection('users')
      .aggregate(pipeline)
      .toArray();
    await con.close();
    return res.send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/rest-api/users/:order?', async (req, res) => {
  try {
    const con = await client.connect();

    const pipeline = [
      // { $addFields: { membershipId: { $toObjectId: '$membership_id' } } },
      {
        $lookup: {
          from: 'memberships',
          localField: 'membership_id',
          foreignField: '_id',
          as: 'membership',
        },
      },
      //  rikiuoju ne pagal vardą
      {
        $sort: {
          name: req.params.order?.toLowerCase() === 'dsc' ? -1 : 1,
        },
      },
    ];

    const data = await con
      .db('rest-api')
      .collection('users')
      .aggregate(pipeline)
      .toArray();
    await con.close();
    return res.send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/rest-api/users', async (req, res) => {
  if (!req.body.membership_id) {
    return res.status(400).send({ err: 'Incorrect membership_id passed' });
  }
  if (!req.body.name || !req.body.surname || !req.body.email) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }

  try {
    const con = await client.connect();
    const dbRes = await con.db('rest-api').collection('users').insertOne({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      membership_id: ObjectId(req.body.membership_id),
    });
    await con.close();
    return res.send(dbRes);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/rest-api/memberships', async (req, res) => {
  console.log(req.body);
  if (!req.body.name) {
    return res.status(400).send({ err: 'Name is not provided' });
  }
  if (!req.body.price) {
    return res.status(400).send({ err: 'Price is not provided' });
  }
  if (!req.body.description) {
    return res.status(400).send({ err: 'Description is not provided' });
  }

  try {
    const con = await client.connect();
    const dbRes = await con.db('rest-api').collection('memberships').insertOne({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    });
    await con.close();
    return res.send(dbRes);
  } catch (err) {
    return res.status(500).send(err);
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));
