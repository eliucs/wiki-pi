/**
* newCourseResults.js
*
* Client side code to control page resize properties, edit properties of the
* results, and send AJAX request to server once the user is finished with
* course creation.
*
**/

$(document).ready(() => {

  // Scroll to the top of the page once the screen size is greater or equal to
  // 768px, this fixes the issue where the screen gets 'stuck' on resize if it
  // was scrolled because in the CSS, at screen sizes > 768px overflow becomes
  // hidden
  $(window).resize(() => {
    if ($(this).width() >= 768) {
      $(this).scrollTop(0);
    }
  });

  // Update articles found:
  let articlesFoundText;
  if (articlesFound <= 1) {
    articlesFoundText = `${articlesFound} article found.`;
  } else {
    articlesFoundText = `${articlesFound} articles found.`;
  }
  $('#articles-found').text(articlesFoundText);

  // Update articles results list:
  let articlesResultsList = $('#articles-results-list');

  articlesResults.forEach((article, i) => {
    let articleCard = $(document.createElement('div'))
    .addClass('col-md-12 new-course-results-article-card')
    .appendTo(articlesResultsList);

    let articleTitle = $(document.createElement('div'))
    .addClass('new-course-results-article-card-title')
    .text(article.title)
    .attr('data-id', i)
    .appendTo(articleCard);
  });

  // For debugging purposes:
  // console.log(articlesResults);

  $('.new-course-results-article-card-title').click((event) => {
    let articleId = $(event.target).attr('data-id');
    let articleContent = articlesResults[articleId].content;

    $('#article-view').css('display', 'block');
    $('#article-view').empty(); // Prevent memory leaks
    let articleView = $('#article-view');

    articleContent.forEach((item) => {
      let tag;
      switch(item.h) {
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

      let articleElement = $(document.createElement(tag))
      .text(item.txt)
      .appendTo(articleView);
    });
  });

  $('#btn-create-course-finish').click(() => {

  });
});
