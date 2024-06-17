const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://rak404278:rnqspclzls2@cafeteriacluster.tgnhdxh.mongodb.net/CafeteriaManagementSystem?retryWrites=true&w=majority&appName=CafeteriaCluster';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const mealSchema = new mongoose.Schema({
  date: String,
  menu: String,
  ratings: [Number]
});

const Meal = mongoose.model('Meal', mealSchema);

app.post('/meals', (req, res) => {
  const meal = new Meal(req.body);
  meal.save().then(() => res.status(201).send(meal));
});

app.get('/meals', (req, res) => {
  Meal.find().then((meals) => res.send(meals));
});

app.post('/meals/:id/rate', (req, res) => {
  const { rating } = req.body; // 요청 본문에서 rating 값을 추출
  if (typeof rating !== 'number') {
    return res.status(400).send({ error: 'Rating must be a number' });
  }

  Meal.findById(req.params.id).then((meal) => {
    if (!meal) {
      return res.status(404).send({ error: 'Meal not found' });
    }

    meal.ratings.push(rating); // rating 값을 ratings 배열에 추가
    meal.save().then(() => res.send(meal));
  }).catch(err => res.status(500).send(err));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
