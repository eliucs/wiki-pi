'use strict';

/**
 * 
 * section.js
 * 
 * Client side code for rendering the section content.
 * 
 */

$(document).ready(function () {
    // For debugging:
    console.log(sectionData);
    // console.log(sectionID);

    // Scroll to the top of the page once the screen size is greater or equal to
    // 768px, this fixes the issue where the screen gets 'stuck' on resize if it
    // was scrolled because in the CSS, at screen sizes > 768px overflow becomes
    // hidden
    $(window).resize(function () {
        if ($(undefined).width() >= 768) {
            $(undefined).scrollTop(0);
        }
    });

    // Render title, section content:
    $('#section-title').html(sectionData.title);
    $('#article-view').append($(document.createElement('h1')).text(sectionData.title)).append($(document.createElement('p')).text(sectionData.summarizedText));

    // Handle back button:
    $('#btn-back').click(function () {
        window.location.href = '/course-overview';
    });

    // Handle button mark as completed/uncompleted:
    if (sectionData.completed) {
        $('#btn-mark-completed').text('Mark as Uncompleted');
    } else {
        $('#btn-mark-completed').text('Mark as Completed');
    }

    $('#btn-mark-completed').click(function (event) {
        var data = { sectionID: sectionID };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/course-completed",
            success: function success(_success) {
                _success = _success.courseUpdated;
                if (_success) {
                    console.log('Success: course updated.');
                }
                window.location.href = '/course-overview';
            },
            error: function error(err) {
                err = err.responseJSON;

                if (err.nullCourseData) {
                    console.log('Error: course data is null.');
                } else if (err.nullCourseID) {
                    console.log('Error: course ID is null.');
                } else if (err.nullSectionID) {
                    console.log('Error: section ID is null.');
                } else if (err.updatingCourseDB) {
                    console.log('Error: problem updating database.');
                }
            }
        });
    });
});