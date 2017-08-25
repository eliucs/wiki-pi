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

        var courseGraph = $(document.createElement('canvas')).css('height', '8em').attr('id', course.id).appendTo(b);

        console.log(course.totalNumSections);
        console.log(course.completedNumSections);
    });

    // Render course progress graphs:
    // Create graph contexts, graph data:
    var renderChart = function renderChart(chart, context, type, data) {
        chart = new Chart(context, {
            type: type,
            data: data,
            options: {
                legend: {
                    display: true,
                    position: 'left'
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    var graphContexts = [];
    var graphData = [];
    var chartData = [];
    savedCourses.forEach(function (course) {
        var context = $('#' + course.id)[0].getContext('2d');
        var data = {
            labels: ['Completed', 'Not Completed'],
            datasets: [{
                data: [course.completedNumSections, course.totalNumSections - course.completedNumSections],
                backgroundColor: ['rgba(50, 205, 50, 0.2)', 'rgba(126, 126, 126, 0.2)'],
                borderColor: ['rgba(50, 205, 50, 1)', 'rgba(126, 126, 126, 1)'],
                borderWidth: 1
            }]
        };

        graphContexts.push(context);
        graphData.push(data);
        chartData.push({
            graph: course.id,
            context: context,
            data: data,
            type: 'doughnut'
        });
    });

    // Render charts:
    chartData.forEach(function (entry) {
        entry.graph = new Chart(entry.context, {
            type: entry.type,
            data: entry.data,
            options: {
                legend: {
                    display: true,
                    position: 'left'
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });
});