'use strict';

/**
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

  // Update articles results list:
  var articlesResultsList = $('#articles-results-list');

  articlesResults.forEach(function (article, i) {
    var articleCard = $(document.createElement('div')).addClass('col-md-12 new-course-results-article-card').appendTo(articlesResultsList);

    var articleTitle = $(document.createElement('div')).addClass('new-course-results-article-card-title').text(article.title).attr('data-id', i).appendTo(articleCard);
  });

  // For debugging purposes:
  // console.log(articlesResults);

  $('.new-course-results-article-card-title').click(function (event) {
    var articleId = $(event.target).attr('data-id');
    var articleContent = articlesResults[articleId].content;

    $('#article-view').css('display', 'block');
    $('#article-view').empty(); // Prevent memory leaks
    var articleView = $('#article-view');

    var articleDelete = $(document.createElement('a')).addClass('new-course-results-delete-card').text('Delete').appendTo(articleView);

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

  $('#btn-create-course-finish').click(function () {});
});