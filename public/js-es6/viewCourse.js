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


    // Render course statistics charts (course progress, time spent, grade):
    let chartData = [];
    let contextCourseProgress = $('#course-progress-chart')[0].getContext('2d');
    let contextTimeSpent = $('#course-time-chart')[0].getContext('2d');

    let dataCourseProgress = {
        labels: ['Completed', 'Uncompleted'],
        datasets: [{
            data: [5, 5],
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
            data: [20, 5],
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

 });