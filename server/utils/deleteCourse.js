/**
 * 
 * deleteCourse.js
 * 
 * This module deletes a course from the courses database.
 * 
 **/

const path = require('path');
const sqlite = require('sqlite3').verbose();

const codes = require('./codes');

const COURSES_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

const deleteCourse = (id, callback) => {
    if (!id) {
        console.log('Error: deleting course with null id.');
        return callback(codes.ERROR_NULL_ID_DELETING_COURSE, undefined, undefined);
    }

    const db = new sqlite.Database(COURSES_LOCATION);

    db.run(`DELETE FROM courses_table WHERE id=?`, [id], (err) => {

        if (err) {
            console.log('Error: a problem occured deleting course from database.');
            return callback(codes.ERROR_DELETING_COURSE_FROM_DB, undefined, db);
        }

        console.log('Success: deleted course.');
        return callback(undefined, codes.SUCCESS_DELETING_COURSE, db);
    });
};

module.exports = {
  deleteCourse
};
