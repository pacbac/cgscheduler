var today = new Date();
var numRows = 0;
const rowMargin = 2;
var edits = {}; //list of edits to be sent to server
var dates = []; //list of dates on scheduler
var categories = ['newDate', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']
var entries = {
  place: [],
  children: [],
  youth: []
}

//override toString for convenient use
Date.prototype.toString = function() {
  return `${this.getMonth()+1}/${this.getDate()}/${this.getFullYear()}`
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

  //populate the table with previously saved edits
  categories.forEach(category => {
    let datesWEdit = dates.filter(date => date in edits && category in edits[date])
    datesWEdit.forEach((date, i) => $(`.dates .element${i+1}`).text(edits[date][category]))
  })
});

function loadListeners() {
  /*
    toggle text field on manual text entry elements
    the arrow MUST ALWAYS be there or else grandchildren+ will have unexpected behavior!
  */
  $(".notebook > div:not(.youth):not(.children):not(.place) .element").click(function() {
    if($(this).children("input").hasClass("edit-field")) return; //no need to retoggle same element clicked on
    else if($(".element").has(".edit-field").length){ //if edit-field already exists
      let val = $(".edit-field").val()
      $(".edit-field").parent().html(val)
    }
    let val = $(this).text()
    $(this).html("<input type='text' class='edit-field'>")
    $(".edit-field").val(val)
  })

  /*
    toggle text field on dropdown menu elements
    the arrow MUST ALWAYS be there or else grandchildren+ will have unexpected behavior!
  */
  $(".notebook > div:not(.dates):not(.topic):not(.moderator):not(.remarks) .element").click(function() {
    if($(this).children("select").hasClass("edit-field")) return; //no need to retoggle same element clicked on
    else if($(".element").has(".edit-field").length){ //if edit-field already exists
      let val = $(".edit-field").val()
      $(".edit-field").parent().html(val)
    }
    let val = $(this).text()
    let category = $(this).parent().parent().attr("class") //category the clicked object is from
    //create <select> dropdown as an edit field
    let entryHTML = entries[category].reduce((total, entry) => `${total}<option value=${entry}>${entry}</option>`
                                              , "<select class='edit-field' onchange='selectOnChanged()'>")
    $(this).html(entryHTML)
    $(".edit-field").val(val)
  })

  //attempt to save date when user presses enter
  $(document).on("keypress", ".dates input.edit-field", e => {
    if(e.which == 13){
      if(checkDateFormat($(".edit-field").val())){
        let key = getKey()
        let newDate = $(".edit-field").val()
        if(newDate != key){
          if(key in edits)
            edits[key][newDate] = newDate
          else
            edits[key] = { newDate }
          $("button").show()
        }
        $(".edit-field").parent().html(newDate)
      } else
        alert("Error: Enter a valid date")
    }
  })

  /*
    attempt to save chenges when user presses enter
    the arrow MUST ALWAYS be there or else grandchildren+ will have unexpected behavior!
  */
  $(document).on("keypress", ".notebook > div:not(.dates) input.edit-field", e => {
    if(e.which == 13){
      let val = $(".edit-field").val()
      let key = getKey()
      let category = getCategory()
      if(key in edits)
        edits[key][category] = val
      else
        edits[key] = { [category]: val }
      $(".edit-field").parent().html(val)
      $("button").show() //show save button
    }
  })

  $("button[name='cancel']").click(() => location.reload())
  $("button[name='save']").click(() => {
    $.post('/post', {edits}, json => {
      console.log("Posted!") //temp notif
    })
  })

  //editing the entries pool
  $("button[name='edit-entries-pool']").click(() => {
    if($("button[name='edit-entries-pool']").text() == "Edit Entries Pool"){
      $(".entries-pool > div").show()
      $("button[name='edit-entries-pool']").text("Save Entries Pool")
    } else {
      $(".entries-pool > div").hide()
      $("button[name='edit-entries-pool']").text("Edit Entries Pool")
      console.log(Object.keys(entries))
      Object.keys(entries)
        .filter(key => $(`.${key}-entries > .entries`).has("textarea").length) //select only keys with a textarea
        .forEach(key => {
          //get entries from textarea, split elements by space or line break
          let entriesArr = $(`.${key}-entries > .entries > textarea`).val().split("\n")
          entries[key] = entries[key].concat(entriesArr)
        })
    }
  })

  $(".entries").click(function() {
    if(!$(this).has("textarea").length){
      $(this).html(`<textarea class="entries-area">${$(this).text()}</textarea>`)
    }
  })
}

//for <select>
function selectOnChanged() {
  let val = $(".edit-field").val()
  let key = getKey()
  //create obj in edits before assigning properties to it, avoid undefined behavior
  if(!(key in edits)) edits[key] = {}
  edits[key][getCategory()] = val
  $(".edit-field").parent().html(val)
}

//used only when .edit-field exists
function getCategory(){
  return $(".edit-field").parent().parent().parent().attr("class")
}

//gets the class of .element at index n and extract the corresponding date
function getKey() {
  let classes = $(".edit-field").parent().attr("class").split(" ")
  let index = parseInt(classes[1].charAt(classes[1].length - 1)) - 1
  return dates[index].toString()
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
