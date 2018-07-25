var today = new Date();
var startDate = new Date(today.getFullYear(), 0, 1)
var edits = {}; //list of edits to be sent to server
var dates = []; //list of dates on scheduler
var categories = ['newDate', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']
var entries = {
  place: new Set(),
  moderator: new Set(),
  children: new Set(),
  youth: new Set()
}

//override toString for convenient use
Date.prototype.toString = function() {
  return `${this.getMonth()+1}/${this.getDate()}/${this.getFullYear()}`
}

$(document).ready(function(){
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
  $(".notebook > div:not(.youth):not(.children):not(.place):not(.moderator) .element").click(function() {
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
  $(".notebook > div:not(.dates):not(.topic):not(.remarks) .element").click(function() {
    if($(this).children("select").hasClass("edit-field")) return; //no need to retoggle same element clicked on
    else if($(".element").has(".edit-field").length){ //if edit-field already exists
      let val = $(".edit-field").val()
      $(".edit-field").parent().html(val)
    }
    let val = $(this).text()
    let category = $(this).parent().parent().attr("class") //category the clicked object is from
    //create <select> dropdown as an edit field from the set of entries
    let entryHTML = Array.from(entries[category])
                          .reduce((total, entry) => `${total}<option value=${entry}>${entry}</option>`
                                              , "<select class='edit-field' onchange='selectOnChanged()'>")
    entryHTML += "<option value='Cancelled'>Cancelled</option></select>"
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
            edits[key]['newDate'] = newDate
          else
            edits[key] = { newDate }
          $("button").show()
        } else
          deleteObjProp(key, 'newDate')
          //if we wish to revert the date back to the auto-gen'd version, delete the edit data
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

      if(val == "") //if new value just resets entry, delete from edits object
        deleteObjProp(key, category)
      $(".edit-field").parent().html(val)
      $("button").show() //show save button
    }
  })

  $("button[name='cancel']").click(() => location.reload())
  $("button[name='save-tbl']").click(() => {
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
      Object.keys(entries)
        .filter(key => $(`.${key}-entries > .entries`).has("textarea").length) //select only keys with a textarea
        .forEach(key => {
          //get entries from textarea, split elements by space or line break
          let entriesArr = $(`.${key}-entries > .entries > textarea`).val().split("\n")
          entries[key].clear()
          entriesArr.forEach(entry => entries[key].add(entry))
          if(entries[key].has("")) entries[key].delete("")
          $(`.${key}-entries > .entries`).html(entriesArr.join("<br>"))
        })
    }
  })

  //when an entry pool box is clicked on, open a textarea to edit
  $(".entries").click(function() {
    if(!$(this).has("textarea").length)
      $(this).html(`<textarea class="entries-area">${$(this).html().replace(/<br>/g, "\n")}</textarea>`)
      // /<br>/g supports replacement of all line breaks, instead of just the first instance
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

//avoid memory leaks with useless edits
function deleteObjProp(key, category = undefined){
  if(key in edits){
    if(category in edits[key])
      delete edits[key][category]
    if(Object.keys(edits[key]).length === 0 && edits[key].constructor === Object)
      delete edits[key] //delete the parent object as well if it is now empty
  } else
    throw new Error(`${key} not available to delete`)
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
  const [thisYr, thisMonth, thisDate] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()];

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

  for(let i = 0;; i++){
    let addThisDate = getSaturday(new Date(thisYr, thisMonth+(i/2), (i % 2 === 0) ? 1 : 15));
    if(addThisDate.getFullYear() === today.getFullYear()){
      $(".info").append("<div  class='element element"+(i+1)+"'></div>");
      processDays(addThisDate, i+1)
      dates.push(addThisDate)
    } else
      break;
  }
}
