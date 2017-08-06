/**
* Client side JavaScript for new course page
**/

const errorFields = ["#empty-starting-article"];

$("#text-similarity").mousemove(() => {
  var percent = $("#text-similarity").val();
  var text = percent + "%";
  var color;

  if (percent == 100) {
    text += " Exactly the same"
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

$("#btn-create-course").click(() => {
  const startingArticle = typeof($("#starting-article").val()) == 'undefined' ?
  "" : $("#starting-article").val();
  const endingArticle = typeof($("#ending-article").val()) == 'undefined' ?
  "" : $("#ending-article").val();
  const textSimilarity = $("#text-similarity").val();

  // For debugging:
  // console.log(startingArticle);
  // console.log(endingArticle);
  // console.log(textSimilarity);

  var errors = verifyFields(startingArticle);

  if (errors.length > 0) {
    errorFields.forEach((error) => {
      $(error).css("display", "none");
    });

    errors.forEach((error) => {
      $(error).css("display", "block");
    });
  } else {
    $("#loading-container").css("display", "block");

    errorFields.forEach((error) => {
      $(error).css("display", "none");
    });

    var data = {
      startingArticle: startingArticle,
      endingArticle: endingArticle,
      textSimilarity: textSimilarity
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/new-course',
      success: function(success) {
        $("#loading-container").css("display", "none");

        if (success.successCode === 1002) {
            console.log('Success: article found and course generated.');
        }
      },
      error: function(error) {
        $("#loading-container").css("display", "none");

        if (error.responseJSON.errorCode === 2001) {
          console.log('Error: connecting to database.');
        } else if (error.responseJSON.errorCode === 2002) {
          console.log('Error: no article found.');
        }
      }
    });
  }
});

function verifyFields(startingArticle) {
  var errors = [];

  if (typeof(startingArticle) == 'undefined' || startingArticle.length == 0) {
    errors.push("#empty-starting-article");
  }

  return errors;
}
