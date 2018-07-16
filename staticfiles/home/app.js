var today = new Date();
var nextMeet = new Date();
var numRows = 0;
var selected = "place";

var roles = {
  "place" : ["Robert", "Daniel", "Pak", "Scott"],
  "children": ["Sharon", "Doris", "Joe", "Daniel", "Vincent", "Fion", "Florin"],
  "youth" : ["Pak", "Robert", "Gary", "Scott", "Lai Lee"],
  "moderator" : ["Vincent", "Gary", "Fion", "Pak", "Joe", "Florin", "Daniel", "Scott"]
}
var exceptionsStr = "";
var exceptions;
/*
Each exception follows the same format:
var exception = function()
*/

$(document).ready(function(){
  var rowMargin = 2;
  var rowHeight = $(".navbar").height()+rowMargin;
  numRows = Math.floor(($(".notebook").height()-$(".navbar").height())/rowHeight);
  for(let i = 0; i < numRows; i++){
    $(".info").append("<div  class='element element"+(i+1)+"'></div>");
  }

  $(".navbar .col").on("click", function(){
    switch(this.id){
      case "place": loadRole("place"); break;
      case "moderator": loadRole("moderator"); break;
      case "youth": loadRole("youth"); break;
      case "children": loadRole("children"); break;
    }
  });
  dispData();
});

function dispData(){
  loadDates();
}

function loadDates(){
  function getSaturday(year, month, day){
    var date = new Date(year, month, day, 0, 0, 0, 0);
    if(day <= 14)
      date.setDate(14-date.getDay());
    else if(day <= 28)
      date.setDate(28-date.getDay());
    return date;
  };

  for(let i = 0, monthInd = 0; i < numRows, monthInd < Math.floor(numRows/2); i+=2, monthInd++){
    var addThisDate = getSaturday(today.getFullYear(), today.getMonth()+monthInd, 1);
    $("#date .element"+(i+1)).text((addThisDate.getMonth()+1)+"/"+addThisDate.getDate()+"/"+addThisDate.getFullYear());
    if(addThisDate.getMonth() == today.getMonth() && addThisDate.getDate() >= today.getDate())
      $(".element"+(i+1)).addClass("upcoming");

    addThisDate = getSaturday(today.getFullYear(), today.getMonth()+monthInd, 15);
    $("#date .element"+(i+2)).text((addThisDate.getMonth()+1)+"/"+addThisDate.getDate()+"/"+addThisDate.getFullYear());
    if(addThisDate.getMonth() == today.getMonth() && addThisDate.getDate() >= today.getDate())
      $(".element"+(i+2)).addClass("upcoming");
  }
}
