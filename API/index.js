const express = require("express");
const { db } = require("./models/index");
const app = express();
const port = 3000;
const cors = require("cors");
const indexRoute = require('./routes/index.js');

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
app.use(express.urlencoded({ extended: true }));
app.use(indexRoute)

app.get("/", (req, res) => {
  res.send('test');
});

// app.post("/daftar", async (req, res) => {
//   const { fullname, email, password, role } = req.body;

//   try {
//     const post_data = await db.query(
//       `INSERT INTO users(fullname, email, password, role) VALUES('${fullname}', '${email}', '${password}', '${role}')`
//     );
//     return res.status(200).json({
//       message: "User Created",
//       data: post_data,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: error,
//     });
//   }
// });

// app.get("/users", async (req, res) => {
//   try {
//     const User = await db.query("SELECT fullname, email, password FROM users");
//     return res.status(200).json({
//       message: "Berhasil mendapatkan Users",
//       data: User,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: error,
//     });
//   }
// });


  // app.post("/login", async (req, res) => {
  //   const { email, password } = req.body;
  //   try {
  //     const User = await db.query(
  //       `SELECT fullname FROM users WHERE email = '${email}' AND password = '${password}' `,
  //     );
  
  //     if (User.length === 1) {
  //       const login_log = await db.query(
  //         `INSERT INTO logs(pesan, waktu) VALUES ("User dengan ID ${
  //           User[0].id
  //         } telah login", "${new Date()
  //           .toISOString()
  //           .slice(0, 19)
  //           .replace("T", " ")}")`,
  //       );
  
  //       const token = jwt.sign(User[0], process.env.JWT_SECRET_KEY, {
  //         expiresIn: "3600s",
  //       });
  
  //       return res.json({
  //         msg: "Logged In",
  //         data: token,
  //       });
  //     }
  
  //     return res.json({
  //       msg: "User not Found",
  //     });
  //   } catch (error) {
  //     return res.json({
  //       msg: "Error occured when logging in",
  //     });
  //   }
  // });

app.listen(port, () => {
  console.log(`Aplikasi berjalan pada port ${port}`);
});
