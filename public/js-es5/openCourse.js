'use strict';

/**
 * 
 * openCourse.js
 * 
 * Client side code for rendering saved courses or displaying empty courses 
 * when there are none.
 * 
 **/

$(document).ready(function () {
    // Display empty courses if there are no courses, otherwise show the 
    // open course container:
    if (typeof savedCourses === 'undefined' || savedCourses.length === 0) {
        $('#empty-open-course').css('display', 'block');
    } else {
        $('#open-course-container').css('display', 'block');
    }

    // Helper function to format dates from timestamp:
    var formatDate = function formatDate(timestamp) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var date = new Date(timestamp);
        var month = monthNames[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();

        return month + ' ' + day + ', ' + year;
    };

    // Display saved courses:
    var openCoursesList = $('#open-courses-list');
    savedCourses.forEach(function (course) {
        var a = $(document.createElement('div')).addClass('col-md-4').appendTo(openCoursesList);

        var b = $(document.createElement('div')).addClass('card-container').attr('data-id', course.id).appendTo(a);

        var courseTitle = $(document.createElement('div')).addClass('course-card-title').text(course.title).appendTo(b);

        var courseDateCreated = $(document.createElement('div')).addClass('course-card-desc').text('Date Created: ' + formatDate(course.id)).appendTo(b);
    });
});