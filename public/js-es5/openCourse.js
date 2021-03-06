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
    // For debugging:
    // console.log(savedCourses);

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
    (function (global) {
        var openCoursesList = $('#open-courses-list');
        savedCourses.forEach(function (course) {
            var a = $(document.createElement('div')).addClass('col-md-4').appendTo(openCoursesList);

            var b = $(document.createElement('div')).addClass('card-container').attr('data-id', course.id).appendTo(a);

            var courseTitleContainer = $(document.createElement('div')).appendTo(b);

            var courseTitle = $(document.createElement('span')).addClass('course-card-title').attr('data-id', course.id).attr('data-toggle', 'modal').attr('data-target', '#basicExample').attr('unselectable', 'on').attr('onselectstart', 'return false').attr('onmousedown', 'return false').text(course.title).appendTo(courseTitleContainer);

            var courseDateCreated = $(document.createElement('div')).addClass('course-card-desc').text('Date Created: ' + formatDate(course.id)).appendTo(b);

            var d = $(document.createElement('div')).appendTo(b);

            var courseGraph = $(document.createElement('canvas')).attr('id', course.id).css('height', '8em').appendTo(d);

            // For debug purposes:
            // console.log(course.totalNumSections);
            // console.log(course.completedNumSections);
        });
    })();

    // Render course progress graphs:
    // Create graph contexts, graph data:
    (function (global) {
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
    })();

    var currentOpenModalID = void 0;

    // Open course modal:
    $('.course-card-title').click(function (event) {
        var title = $(event.target).text();
        var id = parseInt($(event.target).attr('data-id'));
        var dateCreated = formatDate(id);
        var courseData = savedCourses.reduce(function (previous, current) {
            return current.id === id ? current : previous;
        }, null);

        currentOpenModalID = id;

        // For debug purposes:
        // console.log(title);
        // console.log(id);
        // console.log(formatDate(id));

        $('#modal-title').html(title);
        $('#modal-id').html('Course ID: ' + id);
        $('#modal-date-created').html('Course Created: ' + dateCreated);
        $('#modal-course-progress').html(courseData.completedNumSections + ' of ' + courseData.totalNumSections + ' section(s) complete.');

        // Render course progress bar:
        var context = $('#modal-course-progress-chart')[0].getContext('2d');
        var bar = new Chart(context, {
            type: 'horizontalBar',
            data: {
                labels: ['Completed'],
                datasets: [{
                    data: [courseData.completedNumSections],
                    backgroundColor: ['rgba(50, 205, 50, 0.2)'],
                    borderColor: ['rgba(50, 205, 50, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            max: courseData.totalNumSections,
                            min: 0,
                            stepSize: 1
                        }
                    }]
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });

    // Open course by making AJAX POST request to server:
    $('#btn-modal-open').click(function () {
        var data = {
            id: currentOpenModalID
        };

        $('#loading-title').html('');
        $('#loading-title').html('Opening course');
        $('#loading-container').css('z-index', '99999');
        $('#loading-container').css('display', 'block');

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/open-course',
            success: function success(_success) {
                _success = _success.courseOpened;
                if (_success) {
                    console.log('Success: course opened.');
                }

                setTimeout(function () {
                    $('#loading-container').css('display', 'none');
                    setTimeout(function () {
                        window.location.href = '/course-overview';
                    }, 100);
                }, 1000);
            },
            error: function error(_error) {
                _error = _error.responseJSON;
                if (err.openingCourseFromDB) {
                    console.log('Error: a problem occurred opening course from database.');
                } else {
                    console.log('Error: a problem occurred.');
                }

                $('#loading-title').html('');
                $('#loading-title').html('A problem occurred opening the course.');

                setTimeout(function () {
                    $('#loading-container').css('display', 'none');
                }, 1000);
            }
        });
    });

    // Delete course by making AJAX DELETE request to server:
    $('#btn-modal-delete').click(function () {
        var data = {
            id: currentOpenModalID
        };

        $('#loading-title').html('');
        $('#loading-title').html('Deleting course');
        $('#loading-container').css('z-index', '99999');
        $('#loading-container').css('display', 'block');

        $.ajax({
            type: "DELETE",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/delete-course",
            success: function success(_success2) {
                _success2 = _success2.courseDeleted;
                if (_success2) {
                    console.log('Success: course deleted.');
                }

                $('#loading-title').html('');
                $('#loading-title').html('Course successfully deleted.');

                setTimeout(function () {
                    $('#loading-container').css('display', 'none');
                    setTimeout(function () {
                        location.reload(false);
                    }, 100);
                }, 1000);
            },
            error: function error(_error2) {
                _error2 = _error2.responseJSON;
                if (err.deleteCourseNullID) {
                    console.log('Error: deleting course with null id.');
                } else if (err.deletingCourseFromDB) {
                    console.log('Error: a problem occurred deleting course from database.');
                } else {
                    console.log('Error: a problem occurred.');
                }

                $('#loading-title').html('');
                $('#loading-title').html('A problem occurred deleting the course.');

                setTimeout(function () {
                    $('#loading-container').css('display', 'none');
                }, 1000);
            }
        });
    });
});