const Course = require('../models/course');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const courses = require('../data/courses');

// Setting dotenv file
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase();

const seedCourses = async () => {
    try {

        await Course.deleteMany();
        console.log('Courses are deleted');

        await Course.insertMany(courses)
        console.log('All Courses are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedCourses()