const express = require("express");
const openAiRouter = require("./routes/openai.js");
const userRouter = require("./routes/users.js");
const connectToDB = require("./database/db.js");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Required Middlewares
app.use(express.json());
app.use(cors());

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Routes
app.use("/", openAiRouter);
app.use("/user", userRouter);

// DataBase
connectToDB();

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});