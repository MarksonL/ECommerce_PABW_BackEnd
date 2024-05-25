const express = require("express");
const { db } = require("./models/index");
const app = express();
const port = 3000;
const cors = require("cors");
const indexRoute = require('./routes/index.js');
const path = require('path')
const bodyParser = require('body-parser');

const connectDB = async () => {
  try {
    // await User
    await db.sync();
    // await db.drop();
    await db.authenticate();
  } catch (error) {
    console.log(error);
  }
};
connectDB();

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(indexRoute)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send('test');
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan pada port ${port}`);
});
