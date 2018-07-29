//import { csrftoken, csrfSafeMethod } from './cookie.js'

const today = new Date();
const startDate = new Date(today.getFullYear(), 0, 1)
var dates = []; //list of dates on scheduler
const categories = ['newDate', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']
var edits = {}; //list of edits to be sent to server
var entries = {
  place: new Set(),
  moderator: new Set(),
  children: new Set(),
  youth: new Set()
}

//override for convenient use
Date.prototype.toString = function() {
  return `${this.getMonth()+1}/${this.getDate()}/${this.getFullYear()}`
}

$(document).ready(function(){
  loadElemListeners();
  loadKeypressListeners();
  loadBtnListeners();

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });

  $(".element").each(function(){
    $(this).text($(this).text().trim())
  })

  //populate the table with previously saved edits
  categories.forEach(category => {
    let datesWEdit = dates.filter(date => date in edits && category in edits[date])
    datesWEdit.forEach((date, i) => $(`.dates .element${i+1}`).text(edits[date][category]))
  })
});

function loadElemListeners() {
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
}

function loadKeypressListeners() {
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

      $(".edit-field").parent().html(val)
      $("button").show() //show save button
    }
  })
}

function loadBtnListeners() {
  $("button[name='cancel']").click(() => location.reload())
  $("button[name='save-tbl']").click(() => {
    $.post('/updateedits', {edits}, json => {
      console.log("Posted!") //temp notif
      alert(json)
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

//listener callback for <select>
function selectOnChanged() {
  let val = $(".edit-field").val().trim()
  let key = getKey()
  let category = getCategory()

  if(!checkRowErr(key, category, val)){
    if(key in edits && 'newDate' in edits[key])
      alert(`Warning: ${val} has conflicts with other roles for ${edits[key]['newDate']}.`)
    else {
      let keyDate = $(`.dates .element${key}`).text()
      alert(`Warning: ${val} has conflicts with other roles for ${keyDate}.`)
    }
  }
  if(!checkColErr(key, category, val)){
    if(key in edits && 'newDate' in edits[key])
      alert(`Warning: ${val} is assigned consecutively to ${category} on ${edits[key]['newDate']}.`)
    else {
      let keyDate = $(`.dates .element${key}`).text()
      alert(`Warning: ${val} is assigned consecutively to ${category} on ${keyDate}.`)
    }
  }

  //create obj in edits before assigning properties to it
  if(!(key in edits)) edits[key] = {}
  edits[key][category] = val
  $(".edit-field").parent().html(val)
  $("button").show()
}

//each row (same date) cannot have duplicate values for: moderator & (youth | children)
function checkRowErr(key, category, val){
  if(category == "place") return true //place should be omitted from evaluation
  if(val == "Cancelled") return true //"Cancelled" doesn't count as duplicate
  if(category == "youth" || category == "children")
    return $(`.moderator .element${key}`).text() != val
  else if(category == "moderator")
    return $(`.children .element${key}`).text() != val && $(`.youth .element${key}`).text() != val
  return true;
}

//each col (same category) cannot have consecutive duplicate values for: moderator, youth, children
function checkColErr(key, category, val){
  if(category == "place") return true //place should be omitted from evaluation
  if(val == "Cancelled" || val.trim() == "") return true //"Cancelled" doesn't count as duplicate
  let nextKey = key + 1
  let prevKey = key - 1
  if($(`.${category} .element${nextKey}`).length && val == $(`.${category} .element${nextKey}`).text())
    return false
    //return false for error b/c strings are the same, true otherwise
  if($(`.${category} .element${prevKey}`).length)
    return val != $(`.${category} .element${prevKey}`).text()
  return true
}

//avoid memory leaks by deleting useless object properties
function deleteObjProp(key, category = undefined){
  if(key in edits){
    if(category in edits[key])
      delete edits[key][category]
    if(Object.keys(edits[key]).length === 0 && edits[key].constructor === Object)
      delete edits[key] //delete the parent object as well if it is now empty
  }
}

//used only when .edit-field exists
function getCategory(){
  return $(".edit-field").parent().parent().parent().attr("class")
}

//gets the index of the element being edited
function getKey() {
  let classes = $(".edit-field").parent().attr("class").split(" ")
  let indxStr = classes[1].substring(classes[1].indexOf("t")+1)
  return parseInt(indxStr)
}

function checkDateFormat(str){
  let splitDate = str.split("/")
  if(splitDate.length != 3) return false
  let [month, day, year] = splitDate
  try {
    [month, day, year] = [parseInt(month), parseInt(day), parseInt(year)]
    let testDate = new Date(year, month-1, day) //month is 0 indexed
    return year === testDate.getFullYear() && month-1 === testDate.getMonth() && day === testDate.getDate()
  } catch(e) {
    console.log(e)
    return false
  }
}
