"use strict";

/**
* newCourse.js
*
* Client side code to validate fields, send AJAX requests to the server for
* new course creations, displays loading screen.
**/

var errorFields = ["#empty-starting-article"];

$("#text-similarity").mousemove(function () {
  var percent = $("#text-similarity").val();
  var text = percent + "%";
  var color = void 0;

  if (percent == 100) {
    text += " Exactly the same";
    color = "#1B5E20";
  } else if (percent >= 90) {
    text += " Significantly similar";
    color = "#2E7D32";
  } else if (percent >= 75) {
    text += " Very similar";
    color = "#388E3C";
  } else if (percent >= 50) {
    text += " Slightly similar";
    color = "#43A047";
  } else if (percent >= 25) {
    text += " Slightly different";
    color = "#E53935";
  } else if (percent >= 10) {
    text += " Very different";
    color = "#D32F2F";
  } else if (percent > 0) {
    text += " Significantly different";
    color = "#C62828";
  } else if (percent == 0) {
    text += " Exactly different";
    color = "#B71C1C";
  }

  $("#text-similarity-percent").text(text);
  $("#text-similarity-percent").css("color", color);
});

$("#btn-create-course").click(function () {
  var startingArticle = $("#course-form-search").find(":selected").text();
  console.log(startingArticle);
  var textSimilarity = $("#text-similarity").val();

  var errors = verifyFields(startingArticle);

  if (errors.length > 0) {
    errorFields.forEach(function (error) {
      $(error).css("display", "none");
    });

    errors.forEach(function (error) {
      $(error).css("display", "block");
    });
  } else {
    $("#loading-container").css("display", "block");
    $("#loading-container").css("z-index", "99999");

    errorFields.forEach(function (error) {
      $(error).css("display", "none");
    });

    var data = {
      startingArticle: startingArticle,
      textSimilarity: textSimilarity
    };

    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/new-course",
      success: function success(_success) {
        _success = _success.courseCreated;
        if (_success) {
          console.log('Success: course created.');
        }

        $("#loading-container").css("display", "none");

        window.location.href = '/new-course-results';
      },
      error: function error(err) {
        err = err.responseJSON;
        if (err.nullStartingArticle) {
          console.log('Error: the starting article is null.');
        } else if (err.retrievingStartingArticleIndex) {
          console.log('Error: retrieving starting article from index db.');
        } else if (err.retrievingStartingArticleData) {
          console.log('Error: retrieving starting article data from articles db.');
        } else {
          console.log('Error: a problem occurred.');
        }

        $("#loading-container").css("display", "none");
      }
    });
  }
});

function verifyFields(startingArticle) {
  var errors = [];

  if (typeof startingArticle == "undefined" || startingArticle.length == 0) {
    errors.push("#empty-starting-article");
  }

  return errors;
}