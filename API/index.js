const express = require("express");
const { db } = require("./models/index");
const app = express();
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

app.listen(3000)
