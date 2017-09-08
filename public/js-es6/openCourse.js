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
        
        let date = new Date(timestamp);
        let month = monthNames[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();

        return `${month} ${day}, ${year}`;
     };

     // Display saved courses:
     (global => {
        let openCoursesList = $('#open-courses-list');
        savedCourses.forEach((course) => {
           let a = $(document.createElement('div'))
           .addClass('col-md-4')
           .appendTo(openCoursesList);
   
           let b = $(document.createElement('div'))
           .addClass('card-container')
           .attr('data-id', course.id)
           .appendTo(a);
   
           let courseTitleContainer = $(document.createElement('div'))
           .appendTo(b);

           let courseTitle = $(document.createElement('span'))
           .addClass('course-card-title')
           .attr('data-id', course.id)
           .attr('data-toggle', 'modal')
           .attr('data-target', '#basicExample')
           .attr('unselectable', 'on')
           .attr('onselectstart', 'return false')
           .attr('onmousedown', 'return false')
           .text(course.title)
           .appendTo(courseTitleContainer);
   
           let courseDateCreated = $(document.createElement('div'))
           .addClass('course-card-desc')
           .text(`Date Created: ${formatDate(course.id)}`)
           .appendTo(b);

           let d = $(document.createElement('div'))
           .appendTo(b);
   
           let courseGraph = $(document.createElement('canvas'))
           .attr('id', course.id)
           .css('height', '8em')
           .appendTo(d);
   
           // For debug purposes:
           // console.log(course.totalNumSections);
           // console.log(course.completedNumSections);
        });
     })();

     // Render course progress graphs:
     // Create graph contexts, graph data:
     (global => {
        let chartData = [];
        savedCourses.forEach((course) => {
           let context = $(`#${course.id}`)[0].getContext('2d');
           let data = {
               labels: ['Completed', 'Not Completed'],
               datasets: [{
                    data: [course.completedNumSections, course.totalNumSections - 
                          course.completedNumSections],
                    backgroundColor: [
                        'rgba(50, 205, 50, 0.2)',
                        'rgba(126, 126, 126, 0.2)'
                    ],
                    borderColor: [
                        'rgba(50, 205, 50, 1)',
                        'rgba(126, 126, 126, 1)'
                    ],
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
        chartData.forEach((entry) => {
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

     let currentOpenModalID;

     // Open course modal:
     $('.course-card-title').click((event) => {
        let title = $(event.target).text();
        let id = parseInt($(event.target).attr('data-id'));
        let dateCreated = formatDate(id);
        let courseData = savedCourses.reduce((previous, current) => { 
            return (current.id === id) ? current : previous; 
        }, null);

        currentOpenModalID = id;

        // For debug purposes:
        // console.log(title);
        // console.log(id);
        // console.log(formatDate(id));

        $('#modal-title').html(title);
        $('#modal-id').html(`Course ID: ${id}`);
        $('#modal-date-created').html(`Course Created: ${dateCreated}`);
        $('#modal-course-progress').html(`${courseData.completedNumSections} of ${courseData.totalNumSections} section(s) complete.`);
        
        // Render course progress bar:
        var context = $('#modal-course-progress-chart')[0].getContext('2d');
        var bar = new Chart(context, {
            type: 'horizontalBar',
            data: {
                labels: ['Completed'],
                datasets: [{
                    data: [courseData.completedNumSections],
                    backgroundColor: [
                        'rgba(50, 205, 50, 0.2)'
                    ],
                    borderColor: [
                        'rgba(50, 205, 50, 1)'
                    ],
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
    $('#btn-modal-open').click(() => {
        let data = {
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
            success: function(success) {
                success = success.courseOpened;
                if (success) {
                    console.log('Success: course opened.');
                }

                setTimeout(() => {
                    $('#loading-container').css('display', 'none');
                    
                }, 1000);
            },
            error: function(error) {
                error = error.responseJSON;
                if (err.openingCourseFromDB) {
                    console.log('Error: a problem occurred opening course from database.');
                } else {
                    console.log('Error: a problem occurred.');
                }
                
                $('#loading-title').html('');
                $('#loading-title').html('A problem occurred opening the course.');

                setTimeout(() => {
                    $('#loading-container').css('display', 'none');
                }, 1000);
            }
        })



    });

    // Delete course by making AJAX DELETE request to server:
    $('#btn-modal-delete').click(() => {
        let data = {
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
            success: function(success) {
                success = success.courseDeleted;
                if (success) {
                    console.log('Success: course deleted.');
                }

                $('#loading-title').html('');
                $('#loading-title').html('Course successfully deleted.');

                setTimeout(() => {
                    $('#loading-container').css('display', 'none');
                    setTimeout(() => {
                        location.reload(false);
                    }, 100);
                }, 1000);
            },
            error: function(error) {
                error = error.responseJSON;
                if (err.deleteCourseNullID) {
                    console.log('Error: deleting course with null id.');
                } else if (err.deletingCourseFromDB) {
                    console.log('Error: a problem occurred deleting course from database.');
                } else {
                    console.log('Error: a problem occurred.');
                }

                $('#loading-title').html('');
                $('#loading-title').html('A problem occurred deleting the course.');

                setTimeout(() => {
                    $('#loading-container').css('display', 'none');
                }, 1000);
            }
        });
    });

    
 });