/**
 * 
 * openCourse.js
 * 
 * Client side code for rendering saved courses or displaying empty courses 
 * when there are none.
 * 
 **/

 $(document).ready(() => {
     // Display empty courses if there are no courses, otherwise show the 
     // saved courses:
     if (typeof(savedCourses) === 'undefined' || savedCourses.length === 0) {
         $('#empty-open-course').css('display', 'block');
     } else {
         $('#open-course-container').css('display', 'block')
     }

 });