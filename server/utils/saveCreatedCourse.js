/**
 * 
 * saveCreatedCourse.js
 * 
 * This module takes the results of a finished course creation and saves it to
 * the database and uses the starting article's title as its title, and the 
 * time created as a unique ID, and returns a Promise. If the course creation
 * is successful, it resolves the Promise with the resulting course Object,
 * otherwise, it rejects the Promise with an error Object.
 * 
 **/

const path = require('path');
const sqlite = require('sqlite3').verbose();
const { getTextFromArticle } = require('./getTextFromArticle');
const { TextSummarizer } = require('./textSummarizer');
const COURSE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/courses/courses.db');

 const saveCreatedCourse = (courseResults) => {

    return new Promise((resolve, reject) => {
        // Check if courseResults is valid:
        if (!courseResults) {
            reject({ nullCourseResults: true });
            return;
        }

        courseResults = courseResults.map((section) => {
            return {
                title: section.content[0].txt,
                summarizedText: TextSummarizer.summarize(
                    getTextFromArticle(section.content), 0.095),
                completed: 0,
                grades: {
                    total: 1,
                    correct: 0
                }
            };
        });

        let title = courseResults[0].title;
        let id = Date.now();
        let course = JSON.stringify(courseResults);
        let totalNumSections = courseResults.length;
        let completedNumSections = 0;
        let completedSections = JSON.stringify([]);
        let timeSpentContent = 0;
        let timeSpentTests = 0;

        // For debugging:
        // console.log(JSON.stringify(courseResults, undefined, 2));

        const db = new sqlite.Database(COURSE_LOCATION);
        
        db.run(`CREATE TABLE IF NOT EXISTS courses_table 
                (title TEXT, 
                id INTEGER, 
                course TEXT, 
                totalNumSections INTEGER, 
                completedNumSections INTEGER, 
                completedSections TEXT,
                timeSpentContent INTEGER,
                timeSpentTests INTEGER)`, 
                (err, results) => {
            
            // Check if there was an error with creating new table 
            // while saving course:
            if (err) {
                db.close();
                reject({ creatingTable: true });
                return;
            }
            
            db.run(`INSERT INTO courses_table VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [title, id, course, totalNumSections, 
                     completedNumSections, completedSections, 
                     timeSpentContent, timeSpentTests],
                    (err, results) => {
                
                // Check if there was an error inserting into table while
                // saving course:
                if (err) {
                    db.close();
                    reject({ insertingIntoTable: true });
                    return;
                }
    
                // Confirm that data has been inserted correctly:
                db.all(`SELECT title, id, course, totalNumSections, 
                        completedNumSections, completedSections, 
                        timeSpentContent, timeSpentTests 
                        FROM courses_table 
                        WHERE id=${id}
                        LIMIT 1`, (err, temp) => {
    
                    if (err) {
                        return console.log(err);
                    }
                    
                    // For debug purposes:
                    console.log(JSON.stringify(temp, undefined, 2));
                });
                
                db.close();
                resolve(results);
            });
        });
    });
 };

 module.exports = {
     saveCreatedCourse
 };
