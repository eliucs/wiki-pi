/**
 * 
 * retrieveSavedCourses.js
 * 
 * This module requests the courses database and returns back (title, id) data
 * from each course, or undefined if the database has no courses saved, and 
 * returns a Promise. If it was successfull retrieving saved course, then it
 * resolves the Promise with the saved courses data, otherwise it rejects the 
 * Promise with an error Object.
 * 
 **/

const path = require('path');
const sqlite = require('sqlite3').verbose();
const codes = require('./codes');
const COURSE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

 const retrieveSavedCourses = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite.Database(COURSE_LOCATION);
        
        db.serialize(() => {
            const query = `SELECT title, id, totalNumSections, completedNumSections
                            FROM courses_table;`;
        
            db.all(query, (err, results) => {
                // Check if there was a database error:
                if (err) {
                    db.close();
                    reject({ retrievingSavedCourses: true });
                    return;
                }
    
                // For debug purposes:
                // console.log(results);

                db.close();
                resolve(results);
            });
        });
    });
 };

 module.exports = {
     retrieveSavedCourses
 };
