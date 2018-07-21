var today = new Date();
var numRows = 0;
const rowMargin = 2;
//so if editing is discarded, this will put the last saved entry back into place
var edits = {}; //list of edits to be sent to server
var dates = []; //list of dates on scheduler

Date.prototype.toString = function() {
  return `${this.getMonth()}/${this.getDay()}/${this.getFullYear()}`
}

$(document).ready(function(){
  { //misc UI adjustments
    let rowHeight = $(".navbar").height()+rowMargin;
    numRows = Math.floor(($(".dates").height()-$(".navbar").height())/rowHeight);
    for(let i = 0; i < numRows; i++)
      $(".info").append("<div  class='element element"+(i+1)+"'></div>");
  }

  loadDates();
  loadListeners();
});

function loadListeners() {
  //toggle text field on clicked element
  $(document).on("click", ".element", function() {
    if($(this).children("input").hasClass("editField")) return; //no need to retoggle same element clicked on
    else if($(".element").has(".editField").length){ //if editField already exists
      let val = $(".editField").val()
      $(".editField").parent().html(val)
    }
    let date = $(this).text()
    $(this).html("<input type='text' class='editField'>")
    $(".editField").val(date)
  })

  //attempt to save date when user presses enter
  $(document).on("keypress", ".dates .editField", e => {
    if(e.which == 13){
      if(checkDateFormat($(".editField").val())){
        let val = $(".editField").val()
        let classes = $(".editField").parent().attr("class").split(" ")
        let index = parseInt(classes[1].charAt(classes[1].length - 1)) - 1
        console.log(dates[index])
        $(".editField").parent().html(val)
        $("button").show()
      } else
        alert("Error: Enter a valid date")
    }
  })
  //attempt to save chenges when user presses enter
  $(document).on("keypress", ".roles .editField", e => {
    if(e.which == 13){
      let val = $(".editField").val()
      $(".editField").parent().html(val)
      $("button").show() //show save button
    }
  })
  //select newly clicked element
  $(".navbar :nth-child(n)").click(function() {
    $(".selected").removeClass("selected")
    $(this).addClass("selected")
  })

  $("button[name='cancel']").click(() => location.reload())
  $("button[name='save']").click(() => {
    $.post('/post', {edits}, json => {

    })
  })
}

function checkDateFormat(str){
  let splitDate = str.split("/")
  if(splitDate.length != 3) return false
  let [month, day, year] = splitDate
  try {
    [month, day, year] = [parseInt(month), parseInt(day), parseInt(year)]
    let testDate = new Date(year, month, day)
    return year === testDate.getFullYear() && month === testDate.getMonth() && day === testDate.getDate()
  } catch(e) {
    console.log(e)
    return false
  }
}

function loadDates(){
  const [thisYr, thisMonth, thisDate] = [today.getFullYear(), today.getMonth(), today.getDate()];

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
    let [addMonth, addDate, addYr] = [addThisDate.getMonth(), addThisDate.getDate(), addThisDate.getFullYear()];
    $(`.dates .element${j}`).text(`${addMonth+1}/${addDate}/${addYr}`);
    if(addMonth === thisMonth && addDate >= thisDate)
      $(`.dates .element${j}`).addClass("upcoming");
  }

  for(let i = 0, monthInd = 0; i < numRows, monthInd < Math.floor(numRows/2); i+=2, monthInd++){
    let addThisDate = getSaturday(new Date(thisYr, thisMonth+monthInd, 1));
    processDays(addThisDate, i+1)
    dates.push(addThisDate)
    addThisDate = getSaturday(new Date(thisYr, thisMonth+monthInd, 15));
    processDays(addThisDate, i+2)
    dates.push(addThisDate)
  }
}
