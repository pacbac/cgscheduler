var today = new Date();
var nextMeet = new Date();
var numRows = 0;
var selected = "place";

$(document).ready(function(){
  var rowMargin = 2;
  var rowHeight = $(".navbar").height()+rowMargin;
  numRows = Math.floor(($(".dates").height()-$(".navbar").height())/rowHeight);
  for(let i = 0; i < numRows; i++)
    $(".info").append("<div  class='element element"+(i+1)+"'></div>");

  $(".navbar .col").on("click", function(){
    switch(this.id){
      case "place": loadRole("place"); break;
      case "moderator": loadRole("moderator"); break;
      case "youth": loadRole("youth"); break;
      case "children": loadRole("children"); break;
    }
  });
  loadDates();

  var toggleTextField = function() {
    if($(this).children("input").hasClass("editField")) return
    else if($(".element").has(".editField").length){
      let date = $(".editField").val()
      $(".editField").parent().html(date)
    }
    let date = $(this).text()
    $(this).html("<input type='text' class='editField'>")
    $(".editField").val(date)
  }
  $(document).on("click", ".element", toggleTextField)
  $(document).on("keypress", ".element", (e) => {
    if(e.which == 13){
      let date = $(".editField").val()
      $(".editField").parent().html(date)
    }
  })
});

function loadDates(){
  const thisYr = today.getFullYear(),
      thisMonth = today.getMonth(),
      thisDate = today.getDate();

  var getSaturday = (year, month, day) => {
    var date = new Date(year, month, day, 0, 0, 0, 0);
    if(day <= 14)
      date.setDate(14-date.getDay());
    else if(day <= 28)
      date.setDate(28-date.getDay());
    return date;
  };

  var processDays = (addThisDate, j) => {
    let addMonth = addThisDate.getMonth(),
        addDate = addThisDate.getDate(),
        addYr = addThisDate.getFullYear()
    $(`.dates .element${j}`).text(`${addMonth+1}/${addDate}/${addYr}`);
    if(addMonth == thisMonth && addDate >= thisDate)
      $(`.dates .element${j}`).addClass("upcoming");
  }

  for(let i = 0, monthInd = 0; i < numRows, monthInd < Math.floor(numRows/2); i+=2, monthInd++){
    let addThisDate = getSaturday(thisYr, thisMonth+monthInd, 1);
    processDays(addThisDate, i+1)
    addThisDate = getSaturday(thisYr, thisMonth+monthInd, 15);
    processDays(addThisDate, i+2)
  }
}
