/**
 * 
 * markSectionCompleted.js
 * 
 * This module is to update a section within a course to be completed,
 * and returns a Promise. If the update is done successfully, the it resolves 
 * the Promise, otherwise it rejects the Promise with an error Object.
 * 
 */

const path = require('path');
const sqlite = require('sqlite3').verbose();
const COURSES_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

 const markSectionCompleted = (params) => {
     return new Promise((resolve, reject) => {
        let courseData = params.courseData;
        let courseID = params.courseID;
        let sectionID = params.sectionID;

        // Check that the course data, course ID and the section ID are all
        // valid:
        if (typeof courseData === 'undefined') {
            reject({ nullCourseData: true });
            return;
        } else if (typeof courseID === 'undefined') {
            reject({ nullCourseID: true });
            return;
        } else if (typeof sectionID === 'undefined') {
            reject({ nullSectionID: true });
            return;
        }

        // For debugging:
        // console.log(`Course ID: ${courseID}`);
        // console.log(`Section ID: ${sectionID}`);

        // Update completedSections, completedNumSections, course field:
        let completedSections = JSON.parse(courseData.completedSections);
        let course = JSON.parse(courseData.course);
        let completedNumSections = courseData.completedNumSections;
        let alreadyCompleted = completedSections.indexOf(sectionID) !== -1;
        

        if (!alreadyCompleted) {
            completedSections.push(sectionID);
            completedNumSections++;
            course[sectionID].completed = 1;
        } else {
            completedSections = completedSections.filter((id) => {
                return id !== sectionID;
            });
            completedNumSections--;
            course[sectionID].completed = 0;
        }
        completedSections = JSON.stringify(completedSections);
        course = JSON.stringify(course);

        // For debugging:
        // console.log(course);
        // console.log(completedSections);

        const db = new sqlite.Database(COURSES_LOCATION);

        db.run(`UPDATE courses_table SET 
                course=?, 
                completedNumSections=?, 
                completedSections=?
                WHERE id=?`, 
            [course, completedNumSections, completedSections, courseID], 
            (err, result) => {
                if (err) {
                    console.log(err);
                    db.close();
                    reject({ updatingCourseDB: true });
                    return;
                }

                console.log('Success: course updated in database.');
                db.close();

                // Update courseData Object to be resolved back and updated
                // to the session:
                courseData.course = course;
                courseData.completedNumSections = completedNumSections;
                courseData.completedSections = completedSections;
                resolve(courseData);
        });
     });
 };

 module.exports = {
     markSectionCompleted
 };
