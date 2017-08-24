/**
 * 
 * retrieveSavedCourses.js
 * 
 * This module requests the courses database and returns back (title, id) data
 * from each course, or undefined if the database has no courses saved.
 * 
 **/

const path = require('path');
const sqlite = require('sqlite3').verbose();

const codes = require('./codes');
const COURSE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

 const retrieveSavedCourses = (callback) => {
    const db = new sqlite.Database(COURSE_LOCATION);

    db.serialize(() => {
        const query = `SELECT title, id
                       FROM courses_table;`;
    
        db.all(query, (err, results) => {
            // Check if there was a database error:
            if (err) {
                console.log('Error: retrieving search results after quering courses.db.');
                return callback(codes.ERROR_RETRIEVING_SAVED_COURSES, [], db);
            }

            // For debug purposes:
            // console.log(results);

            return callback(undefined, results, db);
        });
    });
 };

 module.exports = {
     retrieveSavedCourses
 };
