"use strict";$(document).ready(function(){console.log("Test"),console.log(courseOpened);$("#course-title").html(courseOpened.title),$("#course-id").html("Course ID: "+courseOpened.id),$("#course-created").html("Date Created: "+function(e){var t=["January","February","March","April","May","June","July","August","September","October","November","December"],o=new Date(e);return t[o.getMonth()]+" "+o.getDate()+", "+o.getFullYear()}(courseOpened.id));var e=$("#course-progress-chart")[0].getContext("2d"),t=$("#course-time-chart")[0].getContext("2d"),o={labels:["Completed","Uncompleted"],datasets:[{data:[courseOpened.completedNumSections,courseOpened.totalNumSections-courseOpened.completedNumSections],backgroundColor:["rgba(50, 205, 50, 0.2)","rgba(126, 126, 126, 0.2)"],borderColor:["rgba(50, 205, 50, 1)","rgba(126, 126, 126, 1)"],borderWidth:1}]},n={labels:["Content","Tests"],datasets:[{data:[1,0],backgroundColor:["rgba(156, 39, 176, 0.2)","rgba(33, 150, 243, 0.2)"],borderColor:["rgba(156, 39, 176, 1)","rgba(33, 150, 243, 1)"],borderWidth:1}]},d=void 0;d=$(window).width()<768||!($(window).width()<975);var a=new Chart(e,{type:"doughnut",data:o,options:{legend:{display:d,position:"left",labels:{fontSize:10}},responsive:!0,maintainAspectRatio:!1}}),r=new Chart(t,{type:"doughnut",data:n,options:{legend:{display:d,position:"left",labels:{fontSize:10}},responsive:!0,maintainAspectRatio:!1}});$(window).on("resize",function(e){$(window).width()<768?(a.options.legend.display=!0,r.options.legend.display=!0):$(window).width()<975?(a.options.legend.display=!1,r.options.legend.display=!1):(a.options.legend.display=!0,r.options.legend.display=!0)});var c=JSON.parse(courseOpened.course).map(function(e){return e.grades}).reduce(function(e,t){return e.correctSum+=t.correct,e.totalSum+=t.total,e},{correctSum:0,totalSum:0}),s=Math.round(0===c.totalSum?0:c.correctSum/c.totalSum);$("#course-grade").html(s+"%");var l=$("#course-section-container");JSON.parse(courseOpened.course).forEach(function(e){var t=e.title,o=(e.summarizedText,!!e.completed);$(document.createElement("div")).addClass("row course-content-row").append($(document.createElement("div")).addClass("col-md-1")).append($(document.createElement("div")).addClass("col-md-9").append($(document.createElement("div")).addClass("course-content-card").append($(document.createElement("span")).addClass("course-content-card-title").append($(document.createElement("a")).attr("href","#").text(t))).append($(document.createElement("span")).addClass("course-content-card-completion "+(o?"completed":"uncompleted")).text(o?"Completed":"Uncompleted")))).append($(document.createElement("div")).addClass("col-md-2")).appendTo(l)})});