/**
* newCourseResults.js
*
* Client side code to control page resize properties, edit properties of the
* results, and send AJAX request to server once the user is finished with
* course creation.
*
**/

// Scroll to the top of the page once the screen size is greater or equal to
// 768px, this fixes the issue where the screen gets 'stuck' on resize if it
// was scrolled because in the CSS, at screen sizes > 768px overflow becomes
// hidden
$(window).resize(() => {
  if ($(this).width() >= 768) {
    $(this).scrollTop(0);
  }
});

$('#btn-create-course-finish').click(() => {

});
