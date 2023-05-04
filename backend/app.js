const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
// const dotenv = require('dotenv');
const path = require('path')

const errorMiddleware = require('./middlewares/errors')

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: './config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


// Import all routes
const courses = require('./routes/course');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');
const mediaRoutes = require("./routes/media");
const documentRoutes = require("./routes/document");
const notify = require("./routes/notify");
const registerCourse = require('./routes/registerCourse')
const category = require("./routes/category")
const banner = require("./routes/banner")
const chatRoutes = require("./routes/chat")
const messageRoutes = require("./routes/message")
const questionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/document', documentRoutes);
app.use("/public", express.static(path.join(__dirname, "/public")));


app.use('/api/v1', courses)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)
app.use('/api/v1', notify)
app.use('/api/v1',registerCourse)
app.use('/api/v1',category)
app.use('/api/v1',banner)
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/answer", answerRoutes);

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app