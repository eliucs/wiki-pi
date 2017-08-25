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
     let formatDate = (timestamp) => {
        let monthNames = [
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

     $('.course-card-title').click((event) => {
        let title = $(event.target).text();
        let id = parseInt($(event.target).attr('data-id'));
        let dateCreated = formatDate(id);
        let courseData = savedCourses.reduce((previous, current) => { 
            return (current.id === id) ? current : previous; 
        }, null);

        // For debug purposes:
        // console.log(title);
        // console.log(id);
        // console.log(formatDate(id));

        $('#modal-title').html(title);
        $('#modal-id').html(`Course ID: ${id}`);
        $('#modal-date-created').html(`Course Created: ${dateCreated}`);
        $('#modal-course-progress').html(`${courseData.completedNumSections} of
            ${courseData.totalNumSections} section(s) complete.`);

        

     });
 });