/**
 * 
 * openCourse.js
 * 
 * This module opens a course from the courses database, checks if the 
 * course has already been initialized for the first time, otherwise
 * runs the text summarizer module to summarize all of the article's 
 * text and builds the course material structure, and returns a Promise.
 * If it was successful opening/initializing the course, it resolves the 
 * Promise, otherwise it rejects the Promise with an error Object.
 * 
 */

const path = require('path');
const sqlite = require('sqlite3').verbose();
const COURSES_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

const openCourse = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ openCourseNullID: true });
            return;
        }
    
        const db = new sqlite.Database(COURSES_LOCATION);

        db.each('SELECT * FROM courses_table WHERE id=?', [id], (err, result) => {
            if (err) {
                db.close();
                reject({ openingCourseFromDB: true });
                return;
            }

            db.close();
            resolve(result);
        });
    });
};

module.exports = {
    openCourse
};
