var today = new Date();
var numRows = 0;
const rowMargin = 2;

$(document).ready(function(){
  var rowHeight = $(".navbar").height()+rowMargin;
  numRows = Math.floor(($(".dates").height()-$(".navbar").height())/rowHeight);
  for(let i = 0; i < numRows; i++)
    $(".info").append("<div  class='element element"+(i+1)+"'></div>");

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
  $(document).on("keypress", ".element", e => {
    if(e.which == 13){
      let date = $(".editField").val()
      $(".editField").parent().html(date)
    }
  })
  $(".navbar :nth-child(n)").click(function() {
    $(".selected").removeClass("selected")
    $(this).addClass("selected")
  })
});

function loadDates(){
  const thisYr = today.getFullYear(),
      thisMonth = today.getMonth(),
      thisDate = today.getDate();

  //calculate the next 2nd or 4th saturday, given a date
  var getSaturday = date => {
    let day = date.getDate(),
        wkDay = date.getDay()
    if(day <= 14)
      date.setDate(14-wkDay);
    else if(day <= 28)
      date.setDate(28-wkDay);
    else
      date.setDate(42-wkDay);
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
    let addThisDate = getSaturday(new Date(thisYr, thisMonth+monthInd, 1));
    processDays(addThisDate, i+1)
    addThisDate = getSaturday(new Date(thisYr, thisMonth+monthInd, 15));
    processDays(addThisDate, i+2)
  }
}
