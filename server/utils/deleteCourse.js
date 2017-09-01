/**
 * 
 * deleteCourse.js
 * 
 * This module deletes a course from the courses database, and returns 
 * a Promise. If it was successful deleting the course, it resolves the 
 * Promise, otherwise it rejects the Promise with an error Object.
 * 
 **/

const path = require('path');
const sqlite = require('sqlite3').verbose();

const codes = require('./codes');

const COURSES_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

const deleteCourse = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ deleteCourseNullID: true });
            return;
        }
    
        const db = new sqlite.Database(COURSES_LOCATION);
    
        db.run(`DELETE FROM courses_table WHERE id=?`, [id], (err) => {
            if (err) {
                db.close();
                reject({ deletingCourseFromDB: true });
                return;
            }
            db.close();
            resolve();
        });
    });
};

module.exports = {
  deleteCourse
};
