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




     const graphCtx = $("#graph")[0].getContext('2d');

     const graphData = {
        labels: ['Completed', 'Not Completed'],
        datasets: [{
            data: [50, 50],
            backgroundColor: [
              'rgba(50, 205, 50, 0.2)',
              'rgba(123, 104, 238, 0.2)'
            ],
            borderColor: [
              'rgba(50, 205, 50, 1)',
              'rgba(123, 104, 238, 1)'
            ],
            borderWidth: 1
          }]
    };

    const graphs = [graph];
    const chartData = [
        {
        graph: graph,
        context: graphCtx,
        data: graphData,
        type: 'doughnut'
        }
    ];
        
    chartData.forEach(function(entry) {
        renderChart(entry.graph, entry.context, entry.type, entry.data);
    });

    function renderChart(chart, context, type, data) {
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
    }

 });