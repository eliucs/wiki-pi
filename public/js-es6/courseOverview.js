/**
 * 
 * viewCourse.js
 * 
 * Client side code for rendering the course page.
 * 
 */

 $(document).ready(() => {
    console.log('Test');

    // For debugging:
    console.log(courseOpened);

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

    // Render course overview elements:
    $('#course-title').html(courseOpened.title);
    $('#course-id').html(`Course ID: ${courseOpened.id}`);
    $('#course-created').html(`Date Created: ${formatDate(courseOpened.id)}`);

    // Render course statistics charts (course progress, time spent, grade):
    let chartData = [];
    let contextCourseProgress = $('#course-progress-chart')[0].getContext('2d');
    let contextTimeSpent = $('#course-time-chart')[0].getContext('2d');

    let dataCourseProgress = {
        labels: ['Completed', 'Uncompleted'],
        datasets: [{
            data: [courseOpened.completedNumSections, 
                courseOpened.totalNumSections - 
                courseOpened.completedNumSections],
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

    let dataTimeSpent = {
        labels: ['Content', 'Tests'],
        datasets: [{
            data: [1, 0],
            backgroundColor: [
                'rgba(156, 39, 176, 0.2)',
                'rgba(33, 150, 243, 0.2)'
            ],
            borderColor: [
                'rgba(156, 39, 176, 1)',
                'rgba(33, 150, 243, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Course progress chart:
    let display;
    if ($(window).width() < 768) {
        display = true;
    } else if ($(window).width() < 975) {
        display = false;
    } else {
        display = true;
    }
    let chartCourseProgress = new Chart(contextCourseProgress, {
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

    let chartTimeSpent = new Chart(contextTimeSpent, {
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
    $(window).on('resize', (event) => {
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
    let grades = JSON.parse(courseOpened.course)
    .map((section) => {
        return section.grades;
    })
    .reduce((previous, current) => {
        previous.correctSum += current.correct;
        previous.totalSum += current.total;
        return previous;
    }, {
        correctSum: 0,
        totalSum: 0
    });

    let weightedGrade = Math.round((grades.totalSum === 0) ? 0 : 
        grades.correctSum / grades.totalSum);

    $('#course-grade').html(`${weightedGrade}%`);

    // Render sections:
    let courseSectionContainer = $('#course-section-container');
    let course = JSON.parse(courseOpened.course);
    course.forEach((section) => {
        const title = section.title;
        const text = section.summarizedText;
        const completed = !!section.completed;

        let s = $(document.createElement('div'))
        .addClass('row course-content-row')
        .append($(document.createElement('div'))
            .addClass('col-md-1'))
        .append($(document.createElement('div'))
            .addClass('col-md-9')
            .append($(document.createElement('div'))
                .addClass('course-content-card')
                .append($(document.createElement('span'))
                    .addClass('course-content-card-title')
                    .append($(document.createElement('a'))
                        .attr('href', '#') // Link
                        .text(title)))
                .append($(document.createElement('span'))
                    .addClass(`course-content-card-completion ${completed ? 'completed' : 'uncompleted'}`)
                    .text(`${completed ? 'Completed' : 'Uncompleted'}`))))
        .append($(document.createElement('div'))
            .addClass('col-md-2'))
        .appendTo(courseSectionContainer);
    });

 });