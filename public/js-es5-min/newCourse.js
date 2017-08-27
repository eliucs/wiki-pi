"use strict";function verifyFields(e){var r=[];return void 0!==e&&0!=e.length||r.push("#empty-starting-article"),r}var errorFields=["#empty-starting-article"];$("#text-similarity").mousemove(function(){var e=$("#text-similarity").val(),r=e+"%",t=void 0;100==e?(r+=" Exactly the same",t="#1B5E20"):e>=90?(r+=" Significantly similar",t="#2E7D32"):e>=75?(r+=" Very similar",t="#388E3C"):e>=50?(r+=" Slightly similar",t="#43A047"):e>=25?(r+=" Slightly different",t="#E53935"):e>=10?(r+=" Very different",t="#D32F2F"):e>0?(r+=" Significantly different",t="#C62828"):0==e&&(r+=" Exactly different",t="#B71C1C"),$("#text-similarity-percent").text(r),$("#text-similarity-percent").css("color",t)}),$("#btn-create-course").click(function(){var e=$("#course-form-search").find(":selected").text();console.log(e);var r=$("#text-similarity").val(),t=verifyFields(e);if(t.length>0)errorFields.forEach(function(e){$(e).css("display","none")}),t.forEach(function(e){$(e).css("display","block")});else{$("#loading-container").css("display","block"),$("#loading-container").css("z-index","99999"),errorFields.forEach(function(e){$(e).css("display","none")});var i={startingArticle:e,textSimilarity:r};$.ajax({type:"POST",data:JSON.stringify(i),contentType:"application/json",url:"/new-course",success:function(e){e=e.successCode,$("#loading-container").css("display","none"),e===SUCCESS_COURSE_CREATED&&console.log("Success: course created."),window.location.href="/new-course-results"},error:function(e){switch(e=e.responseJSON.errorCode,$("#loading-container").css("display","none"),e){case ERROR_COURSE_NOT_CREATED:console.log("Error: course not created.");break;case ERROR_NULL_STARTING_ARTICLE:console.log("Error: the starting article request was null.");break;case ERROR_RETRIEVING_STARTING_ARTICLE_INDEX:console.log("Error: there was a problem retrieving the starting article index from the database.");break;case ERROR_RETRIEVING_STARTING_ARTICLE_DATA:console.log("Error: there was a problem retrieving the starting article data from the database.");break;default:console.log("Error: a problem occurred.")}}})}});