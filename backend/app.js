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
//app.use(fileUpload());
//app.use(fileUpload({useTempFiles: true}))

// Import all routes
const courses = require('./routes/course');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');
const mediaRoutes = require("./routes/media");
const notify = require("./routes/notify");

app.use('/api/v1/media', mediaRoutes);
app.use("/public", express.static(path.join(__dirname, "/public")));


app.use('/api/v1', courses)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)
app.use('/api/v1', notify)

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app