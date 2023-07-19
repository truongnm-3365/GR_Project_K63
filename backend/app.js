const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

const errorMiddleware = require('./middlewares/errors')


if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: './config/config.env' })


app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


const courses = require('./routes/course');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const media = require("./routes/media");
const document = require("./routes/document");
const notify = require("./routes/notify");
const registerCourse = require('./routes/registerCourse')
const category = require("./routes/category")
const banner = require("./routes/banner")
const chat = require("./routes/chat")
const message = require("./routes/message")
const question = require("./routes/questions");
const answer = require("./routes/answers");
const wishList = require("./routes/wishList");
const follow = require("./routes/follow");


app.use("/public", express.static(path.join(__dirname, "/public")));

app.use('/api/v1', courses)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', notify)
app.use('/api/v1/media', media);
app.use('/api/v1/document', document);
app.use('/api/v1',registerCourse)
app.use('/api/v1',category)
app.use('/api/v1',banner)
app.use("/api/v1/chat", chat);
app.use("/api/v1/message", message);
app.use("/api/v1/questions", question);
app.use("/api/v1/answer", answer);
app.use("/api/v1",wishList);
app.use("/api/v1",follow)

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}



app.use(errorMiddleware);

module.exports = app