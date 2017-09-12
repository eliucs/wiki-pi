/**
 * 
 * updateTimeSpent.js
 * 
 * This module updates the time spent on a particular course, and then 
 * returns a Promise. If the update is done successfully, then it resolves
 * the Promise with the updated courseTime object, otherwise, it rejects
 * the Promise with an error Object.
 * 
 */

const path = require('path');
const sqlite = require('sqlite3').verbose();
const COURSES_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

const updateTimeSpent = (params) => {
    return new Promise((resolve, reject) => {
        let courseTime = params.courseTime;
        let courseID = params.courseID;

        // Check if the courseTime Object or the courseID is null:
        if (!courseTime || !courseTime.timestampContent) {
            reject({ nullCourseTime: true });
            return;
        } else if (!courseID) {
            reject({ nullCourseID: true });
            return;
        }

        // The time difference is logged:
        let timeDiffMinutes = Math.round(((Date.now() - 
            courseTime.timestampContent) / 1000) / 60);

        // For debugging:
        // console.log('Time Difference:', timeDiffMinutes);
        
        if (timeDiffMinutes === 0) {
            reject({ noTimeDifference: true });
            return;
        }

        const db = new sqlite.Database(COURSES_LOCATION);
        
        db.run(`UPDATE courses_table SET 
                timeSpentContent = timeSpentContent + 1 
                WHERE id=?`,
            [courseID], 
            (err, result) => {
                if (err) {
                    console.log(err);
                    db.close();
                    reject({ updatingTimeDB: true });
                    return;
                }

                console.log('Success: time spent updated in database.');

                db.all(`SELECT timeSpentContent FROM courses_table WHERE id=? LIMIT 1`, 
                    [courseID], (err, result) => {
                    if (err) {
                        console.log(err);
                        db.close();
                        reject({ retrievingTime: true });
                        return;
                    }

                    let timeSpentContent = result[0].timeSpentContent;

                    console.log('Success: time spent retrieved from database.');

                    db.close();
                    // Update courseData Object to be resolved back and updated
                    // to the session:
                    courseTime = {
                        timestampContent: undefined
                    };
                    resolve({
                        courseTime,
                        timeSpentContent
                    });
                });
        });
    });
};

module.exports = {
    updateTimeSpent
};
