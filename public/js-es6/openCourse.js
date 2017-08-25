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
     // open course container:
     if (typeof(savedCourses) === 'undefined' || savedCourses.length === 0) {
         $('#empty-open-course').css('display', 'block');
     } else {
         $('#open-course-container').css('display', 'block')
     }

     // Helper function to format dates from timestamp:
     const formatDate = (timestamp) => {
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];
        
        const date = new Date(timestamp);
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
     };

     // Display saved courses:
     let openCoursesList = $('#open-courses-list');
     savedCourses.forEach((course) => {
        let a = $(document.createElement('div'))
        .addClass('col-md-4')
        .appendTo(openCoursesList);

        let b = $(document.createElement('div'))
        .addClass('card-container')
        .attr('data-id', course.id)
        .appendTo(a);

        let courseTitle = $(document.createElement('div'))
        .addClass('course-card-title')
        .text(course.title)
        .appendTo(b);

        let courseDateCreated = $(document.createElement('div'))
        .addClass('course-card-desc')
        .text(`Date Created: ${formatDate(course.id)}`)
        .appendTo(b);
     });
 });