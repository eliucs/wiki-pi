"use strict";$(document).ready(function(){$(window).resize(function(){$(void 0).width()>=768&&$(void 0).scrollTop(0)});var e=void 0;e=articlesFound<=1?articlesFound+" article found.":articlesFound+" articles found.",$("#articles-found").text(e),function(e){var t=$("#articles-results-list");t.empty(),articlesResults.forEach(function(e,s){if(e){var o=$(document.createElement("div")).addClass("col-md-12 new-course-results-article-card").appendTo(t);$(document.createElement("div")).addClass("new-course-results-article-card-title").text(e.title).attr("data-id",s).appendTo(o)}})}(),$(".new-course-results-article-card-title").click(function(e){var t=$(e.target).attr("data-id"),s=articlesResults[t].content;$("#article-view").css("display","block"),$("#article-view").empty();var o=$("#article-view");if(0!=t){var a=$(document.createElement("div")).addClass("new-course-results-delete-container").appendTo(o);$(document.createElement("a")).addClass("new-course-results-delete-btn").text("Delete").on("click",function(e){console.log(t),$(".new-course-results-article-card-title[data-id='"+t+"']").parent().css("display","none"),articlesResults[t]=void 0,$("#article-view").css("display","none"),$("#article-view").empty()}).appendTo(a)}s.forEach(function(e){var t=void 0;switch(e.h){case 0:t="p";break;case 1:t="h1";break;case 2:t="h2";break;case 3:t="h3";break;case 4:t="h4";break;case 5:t="h5";break;case 6:t="h6";break;default:t="p"}$(document.createElement(t)).text(e.txt).appendTo(o)})}),$("#btn-create-course-finish").click(function(){var e=[];articlesResults.forEach(function(t){t&&e.push(t)}),e={results:e},console.log(e),$("#loading-title").html(""),$("#loading-title").html("Saving course creation"),$("#loading-container").css("display","block"),$.ajax({type:"POST",data:JSON.stringify(e),contentType:"application/json",url:"/finish-course-creation",success:function(e){(e=e.savedCourse)&&console.log("Success: course saved."),$("#loading-title").html(""),$("#loading-title").html("Course successfully saved."),setTimeout(function(){$("#loading-container").css("display","none"),window.location.href="/open-course"},1e3)},error:function(e){(e=e.responseJSON).nullCourseResults?console.log("Error: course results being saved is null."):e.creatingTable?console.log("Error: creating table while saving course."):e.insertingIntoTable?console.log("Error: inserting into table while saving course."):console.log("Error: a problem occured."),$("#loading-title").html(""),$("#loading-title").html("A problem occurred saving the course."),setTimeout(function(){$("#loading-container").css("display","none")},1e3)}})})});