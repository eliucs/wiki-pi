'use strict';

/**
* 
* newCourseResults.js
*
* Client side code to control page resize properties, edit properties of the
* results, and send AJAX request to server once the user is finished with
* course creation.
*
**/

$(document).ready(function () {

  // Scroll to the top of the page once the screen size is greater or equal to
  // 768px, this fixes the issue where the screen gets 'stuck' on resize if it
  // was scrolled because in the CSS, at screen sizes > 768px overflow becomes
  // hidden
  $(window).resize(function () {
    if ($(undefined).width() >= 768) {
      $(undefined).scrollTop(0);
    }
  });

  // Update articles found:
  var articlesFoundText = void 0;
  if (articlesFound <= 1) {
    articlesFoundText = articlesFound + ' article found.';
  } else {
    articlesFoundText = articlesFound + ' articles found.';
  }
  $('#articles-found').text(articlesFoundText);

  // Update articles results list (immediately invoked on window load):
  (function (global) {
    var articlesResultsList = $('#articles-results-list');
    articlesResultsList.empty(); // Prevent memory leaks

    articlesResults.forEach(function (article, i) {
      if (!article) {
        return;
      }

      var articleCard = $(document.createElement('div')).addClass('col-md-12 new-course-results-article-card').appendTo(articlesResultsList);

      var articleTitle = $(document.createElement('div')).addClass('new-course-results-article-card-title').text(article.title).attr('data-id', i).appendTo(articleCard);
    });
  })();

  // Event Handler for article card on left side:
  $('.new-course-results-article-card-title').click(function (event) {
    var articleId = $(event.target).attr('data-id');
    var articleContent = articlesResults[articleId].content;

    $('#article-view').css('display', 'block');
    $('#article-view').empty(); // Prevent memory leaks
    var articleView = $('#article-view');

    // Only all other articles except the first article (the starting article
    // itself) have the option to be deleted:
    if (articleId != 0) {
      var articleDeleteContainer = $(document.createElement('div')).addClass('new-course-results-delete-container').appendTo(articleView);

      var articleDeleteBtn = $(document.createElement('a')).addClass('new-course-results-delete-btn').text('Delete')
      // Event Handler for delete article button:
      .on('click', function (event) {
        console.log(articleId);

        $('.new-course-results-article-card-title[data-id=\'' + articleId + '\']').parent().css('display', 'none');

        articlesResults[articleId] = undefined;

        $('#article-view').css('display', 'none');
        $('#article-view').empty();
      }).appendTo(articleDeleteContainer);
    }

    articleContent.forEach(function (item) {
      var tag = void 0;
      switch (item.h) {
        case 0:
          tag = 'p';
          break;
        case 1:
          tag = 'h1';
          break;
        case 2:
          tag = 'h2';
          break;
        case 3:
          tag = 'h3';
          break;
        case 4:
          tag = 'h4';
          break;
        case 5:
          tag = 'h5';
          break;
        case 6:
          tag = 'h6';
          break;
        default:
          tag = 'p';
          break;
      }

      var articleElement = $(document.createElement(tag)).text(item.txt).appendTo(articleView);
    });
  });

  // Event Handler for finish course creation button:
  $('#btn-create-course-finish').click(function () {
    var courseResults = [];

    articlesResults.forEach(function (article) {
      if (!article) {
        return;
      }
      courseResults.push(article);
    });

    courseResults = {
      results: courseResults
    };

    console.log(courseResults);

    $('#loading-title').html('');
    $('#loading-title').html('Saving course creation');
    $("#loading-container").css("display", "block");

    $.ajax({
      type: "POST",
      data: JSON.stringify(courseResults),
      contentType: "application/json",
      url: "/finish-course-creation",
      success: function success(_success) {
        _success = _success.successCode;

        $('#loading-title').html('');
        $('#loading-title').html('Course successfully saved.');

        setTimeout(function () {
          $("#loading-container").css("display", "none");
          window.location.href = '/open-course';
        }, 1000);
      },
      error: function error(_error) {
        _error = _error.responseJSON.errorCode;

        $('#loading-title').html('');
        $('#loading-title').html('A problem occurred saving the course.');

        setTimeout(function () {
          $("#loading-container").css("display", "none");
        }, 1000);

        switch (_error) {
          case ERROR_NULL_COURSE_RESULTS:
            console.log('Error: null course results.');
            break;
          case ERROR_NULL_CREATING_TABLE_SAVING_COURSE:
            console.log('Error: problem with database.');
            break;
          case ERROR_NULL_INSERTING_INTO_TABLE_SAVING_COURSE:
            console.log('Error: saving to database.');
            break;
          default:
            break;
        }
      }
    });
  });
});