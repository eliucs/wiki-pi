"use strict";

/**
 * 
 * viewCourse.js
 * 
 * Client side code for rendering the course page.
 * 
 */

$(document).ready(function () {
    // For debugging:
    // console.log(courseOpened);

    // Helper function to format dates from timestamp:
    var formatDate = function formatDate(timestamp) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var date = new Date(timestamp);
        var month = monthNames[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();

        return month + " " + day + ", " + year;
    };

    // Render course overview elements:
    $('#course-title').html(courseOpened.title);
    $('#course-id').html("Course ID: " + courseOpened.id);
    $('#course-created').html("Date Created: " + formatDate(courseOpened.id));

    // Render course statistics charts (course progress, time spent, grade):
    var chartData = [];
    var contextCourseProgress = $('#course-progress-chart')[0].getContext('2d');
    var contextTimeSpent = $('#course-time-chart')[0].getContext('2d');

    var dataCourseProgress = {
        labels: ['Completed', 'Uncompleted'],
        datasets: [{
            data: [courseOpened.completedNumSections, courseOpened.totalNumSections - courseOpened.completedNumSections],
            backgroundColor: ['rgba(50, 205, 50, 0.2)', 'rgba(126, 126, 126, 0.2)'],
            borderColor: ['rgba(50, 205, 50, 1)', 'rgba(126, 126, 126, 1)'],
            borderWidth: 1
        }]
    };

    var dataTimeSpent = {
        labels: ['Content', 'Tests'],
        datasets: [{
            data: [1, 0],
            backgroundColor: ['rgba(156, 39, 176, 0.2)', 'rgba(33, 150, 243, 0.2)'],
            borderColor: ['rgba(156, 39, 176, 1)', 'rgba(33, 150, 243, 1)'],
            borderWidth: 1
        }]
    };

    // Course progress chart:
    var display = void 0;
    if ($(window).width() < 768) {
        display = true;
    } else if ($(window).width() < 975) {
        display = false;
    } else {
        display = true;
    }
    var chartCourseProgress = new Chart(contextCourseProgress, {
        type: 'doughnut',
        data: dataCourseProgress,
        options: {
            legend: {
                display: display,
                position: 'left',
                labels: {
                    fontSize: 10
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    var chartTimeSpent = new Chart(contextTimeSpent, {
        type: 'doughnut',
        data: dataTimeSpent,
        options: {
            legend: {
                display: display,
                position: 'left',
                labels: {
                    fontSize: 10
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Screen resize to disable legend when the screen width becomes less than 
    // 975px:
    $(window).on('resize', function (event) {
        if ($(window).width() < 768) {
            chartCourseProgress.options.legend.display = true;
            chartTimeSpent.options.legend.display = true;
        } else if ($(window).width() < 975) {
            chartCourseProgress.options.legend.display = false;
            chartTimeSpent.options.legend.display = false;
        } else {
            chartCourseProgress.options.legend.display = true;
            chartTimeSpent.options.legend.display = true;
        }
    });

    // Calculate weighted grade:
    var grades = JSON.parse(courseOpened.course).map(function (section) {
        return section.grades;
    }).reduce(function (previous, current) {
        previous.correctSum += current.correct;
        previous.totalSum += current.total;
        return previous;
    }, {
        correctSum: 0,
        totalSum: 0
    });

    var weightedGrade = Math.round(grades.totalSum === 0 ? 0 : grades.correctSum / grades.totalSum);

    $('#course-grade').html(weightedGrade + "%");

    // Render sections:
    var courseSectionContainer = $('#course-section-container');
    var course = JSON.parse(courseOpened.course);
    course.forEach(function (section, i) {
        var title = section.title;
        var text = section.summarizedText;
        var completed = !!section.completed;

        var s = $(document.createElement('div')).addClass('row course-content-row').append($(document.createElement('div')).addClass('col-md-12').append($(document.createElement('div')).addClass('course-content-card').append($(document.createElement('span')).addClass('course-content-card-title').append($(document.createElement('a')).attr('href', "/course-overview/" + i) // Link
        .text(title))).append($(document.createElement('span')).addClass("course-content-card-completion " + (completed ? 'completed' : 'uncompleted')).text("" + (completed ? 'Completed' : 'Uncompleted'))))).appendTo(courseSectionContainer);
    });
});