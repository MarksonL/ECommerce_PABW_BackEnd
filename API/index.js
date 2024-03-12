const express = require("express");
const { db } = require("./models/index");
const app = express();
const jwt = require("jsonwebtoken");
const port = 3000;

const connectDB = async () => {
    try {
        // await User
        await db.sync();
        // await db.drop();
        await db.authenticate()
    } catch (error) {
        console.log(error)
    }
} 
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, rea) =>{
    resizeBy.send("Hello World!")
});

  app.post("/daftar", async (req, res) =>{
    const{fullname, email, password, role} = req.body;

    try{
        const post_data = await db.query(
            `INSERT INTO users(fullname, email, password, role) VALUES('${fullname}', '${email}', '${password}', '${role}')`
            );
        return res.status(200).json({
            message:"User Created",
            data: post_data,
        });
    } catch (error){
        return res.status(400).json({
            message: error
        });
    }
  });
  
  app.get("/users", async (req, res) => {
    try {
      const User = await db.query(
        "SELECT fullname, email, password FROM users"
      );
      return res.status(200).json({
        message: "Berhasil mendapatkan Users",
        data: User,
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  });

app.listen(port, () => {
    console.log(`Aplikasi berjalan pada port ${port}`);
  });
