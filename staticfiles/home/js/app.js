//import { csrftoken, csrfSafeMethod } from './cookie.js'
const thisYear = new Date().getFullYear()
const darkGreen = "#027517";
const darkRed = "#9e4f3f";
const categories = ['newDate', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']
var edits = {} //list of edits to be sent to server
var entries = {} //entry pool

for(let i = -1; i < 2; i++){
  edits[thisYear+i] = {}
  entries[thisYear+i] = { // hold entry pool for each year
    place: {}, // these categories hold a hashset, with true = present, false = deleted
    moderator: {},
    children: {},
    youth: {}
  }
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

  $(".entries").each(function() {
    $(this).html($(this).html().replace(/[ \n]/g, ""))
  })

  //populate entries object w/ previously saved entries
  Object.keys(entries).forEach(yr => {
    Object.keys(entries[yr]).forEach(ctgry => {
      let entrySet = $(`#${yr}-notebook .${ctgry}-entries > .entries`).html().split("<br>").filter(name => name != "")
      entrySet.forEach(entry => entries[yr][ctgry][entry] = true)
    })
  })
});

function loadElemListeners() {

  // behavior navigating tabs
  $(".yr-lbl").click(function() {
    let sn = ".selected-notebook"
    let displayBtns = $(`${sn} .entries-pool > div`).css('display') == 'none'
    $(".selected-yr").removeClass("selected-yr")
    $(this).addClass("selected-yr")
    $(sn).hide()
    let yr = getYr()
    let yrn = `#${yr}-notebook`
    $(`${sn} .entries-pool > div`).hide()
    $(sn).removeClass("selected-notebook")
    $(yrn).addClass("selected-notebook")
    $(sn).show()
    if(!displayBtns){
      $(`${yrn} button[name='cancel-entries']`).show()
      $(`${yrn} .entries-pool > div`).show()
      $(`${yrn} button[name='edit-entries-pool']`).text("Save Entries Pool")
    } else {
      $(`${yrn} button[name='cancel-entries']`).hide()
      $(`${yrn} .entries-pool > div`).hide()
      $(`${yrn} button[name='edit-entries-pool']`).text("Edit Entries Pool")
    }
  })

  /*
    toggle text field on manual text entry elements
    the arrow MUST ALWAYS be there or else grandchildren+ will have unexpected behavior!
  */
  $(".notebook > div")
    .not(".youth, .children, .place, .moderator")
    .find(".element") // element is not a direct child of the category divs
    .click(function() {
    if($(this).children("input").hasClass("edit-field")) return; //no need to retoggle same element clicked on
    else if($(".element").has(".edit-field").length){ //if edit-field already exists
      var modStatus;
      if(getCategory() == 'dates')
        modStatus = dateModified()
      else
        modStatus = notDateModified()
    } else
      modStatus = true;
    if(modStatus){
      let val = $(this).text()
      $(this).html("<input type='text' class='edit-field'>")
      $(".edit-field").val(val)
    }
  })

  /*
    toggle text field on dropdown menu elements
    the arrow MUST ALWAYS be there or else grandchildren+ will have unexpected behavior!
  */
  $(".notebook > div")
    .not(".dates, .topic, .remarks")
    .find(".element")
    .click(function() {
    if($(this).children("select").hasClass("edit-field")) return; //no need to retoggle same element clicked on
    else if($(".element").has("input.edit-field").length){ //if edit-field already exists
      var modStatus;
      if(getCategory() == 'dates')
        modStatus = dateModified()
      else
        modStatus = notDateModified()
      if(!modStatus) return
      let val = $(".edit-field").val()
      $(".edit-field").parent().html(val)
    } else if($(".element").has("select.edit-field").length){
      let val = $(".edit-field").val()
      $(".edit-field").parent().html(val)
    }
    let yr = getYr()
    let val = $(this).text()
    let category = $(this).parent().parent().attr("class") //category the clicked object is from
    //create <select> dropdown as an edit field from the set of entries
    let entryHTML = Object.keys(entries[yr][category])
                          .reduce((total, entry) => `${total}<option value=${entry}>${entry}</option>`
                                              , "<select class='edit-field' onchange='selectOnChanged()'>")
    entryHTML += "<option value=''></option>"
    entryHTML += "<option value='Cancelled'>Cancelled</option></select>"
    $(this).html(entryHTML)
    $(".edit-field").val(val)
  })
}

function loadKeypressListeners() {
  //attempt to save date when user presses enter
  $(document).on("keypress", ".dates input.edit-field", e => {
    if(e.which == 13)
      dateModified()
  })

  /*
    attempt to save chenges when user presses enter
    the arrow MUST ALWAYS be there or else grandchildren+ will have unexpected behavior!
  */
  $(document).on("keypress", ".notebook > div:not(.dates) input.edit-field", e => {
    if(e.which == 13)
      notDateModified()
  })
}

function loadBtnListeners() {
  $("button[name='cancel']").click(() => location.reload())
  $("button[name='save-tbl']").click(() => {
    if($(".edit-field").length){ //add anything currently being edited to the edits object
      let [key, ctgry] = [getKey(), getCategory()]
      if(ctgry == "dates") ctgry = "newDate"
      let yr = getYr()
      if(!(key in edits[yr])) edits[yr][key] = {}
      edits[yr][key][ctgry] = $(".edit-field").val()
    }
    $.post('/updateedits', {edits}, postSendStatus) //update success/fail message after saving table
  })

  $("button[name='cancel-entries']").click(() => {
    $(".entries-pool > div").each(function(){
      let yr = getYr()
      let type = $(this).attr("class")
      type = type.substring(0, type.indexOf("-")) // extract the ${ctgry} part of the class name
      let oldHTML = Object.keys(entries[yr][type]).reduce((total, entry) => total + entry + "<br>", "")
      oldHTML = oldHTML.substring(0, oldHTML.length - 4) // remove the last <br>, which is length 4
      $(this).children(".entries").html(oldHTML)
      $(this).hide()
      $("button[name='cancel-entries']").hide()
      $("button[name='edit-entries-pool']").text("Edit Entries Pool")
    })
  })
  //editing the entries pool
  $("button[name='edit-entries-pool']").click(function() {
    let [$entriesDiv, $cancelBtn] = [$(".entries-pool > div"), $(this).siblings("button[name='cancel-entries']")]
    if($(this).text() == "Edit Entries Pool"){
      $entriesDiv.show()
      $cancelBtn.show()
      $(this).text("Save Entries Pool")
    } else {
      $entriesDiv.hide()
      $cancelBtn.hide()
      $(this).text("Edit Entries Pool")

      Object.keys(entries).forEach(yr => {
        var currEntries = entries[yr]
        Object.keys(currEntries)
          .filter(ctgry => $(`#${yr}-notebook .${ctgry}-entries > .entries`).has("textarea").length) //select only keys with a textarea
          .forEach(ctgry => {
            //get entries from textarea, split elements by space or line break
            let entriesArr = $(`#${yr}-notebook .${ctgry}-entries > .entries > textarea`).val().split("\n")
            //change value of previous entries to false if they have been deleted
            Object.keys(currEntries[ctgry]).forEach(oldEntry => currEntries[ctgry][oldEntry] = oldEntry in entriesArr)
            entriesArr.forEach(entry => currEntries[ctgry][entry] = true) //append new values to entries[ctgry]
            if("" in currEntries[ctgry]) delete currEntries[ctgry][""]
            $(this).parent().parent().siblings(`.${ctgry}-entries`).children(".entries").html(entriesArr.join("<br>"))
          })
      })

      $.post('/updateentries', {entries}, postSendStatus) //update success/fail message after saving entries pool
    }
  })

  //when an entry pool box is clicked on, open a textarea to edit
  $(".entries").click(function() {
    if(!$(this).has("textarea").length)
      $(this).html(`<textarea class="entries-area">${$(this).html().replace(/<br>/g, "\n")}</textarea>`)
      // /<br>/g supports replacement of all line breaks, instead of just the first instance
  })
}

function postSendStatus(json){
  json = JSON.parse(json)
  let $msg = $(".save-options > h3")
  let keys = Object.keys(json)
  if(keys.length === 0 && json.constructor == Object){
    $msg.css("color", darkGreen)
    $msg.text("Posted to database successfully.")
    setTimeout(() => $msg.text(""), 3000)
  } else {
    //print server error message with a list of the slots that don't work
    let msgText = keys.reduce((total, elem) => elem + ", ", "At ")
    msgText = msgText.substr(0, msgText.length - 2) //take away the last comma
    msgText += ": "+json[keys[0]]
    $msg.css("color", darkRed)
    $msg.text(msgText)
  }
}

//response for modification of text field in date category
function dateModified(){
  let newDate = $(".edit-field").val()
  if(checkDateFormat(newDate)){
    let key = getKey()
    let yr = getYr()
    if(newDate != key){
      if(key in edits[yr])
        edits[yr][key]['newDate'] = newDate
      else
        edits[yr][key] = { newDate }
      $("button[name='save-tbl'], button[name='cancel']").show()
    } else
      deleteObjProp(key, 'newDate')
      //if we wish to revert the date back to the auto-gen'd version, delete the edit data
    $(".edit-field").parent().html(newDate)
    return true
  } else{
    alert("Error: Enter a valid date")
    return false
  }
}

//response for modification of other non-date textfield categories
function notDateModified(){
  let [yr, key, category, val] = [getYr(), getKey(), getCategory(), $(".edit-field").val()]
  if(key in edits[yr])
    edits[yr][key][category] = val
  else
    edits[yr][key] = { [category]: val }

  $(".edit-field").parent().html(val)
  $("button[name='save-tbl'], button[name='cancel']").show()
  return true //non-date text fields have no rules
}

//listener callback for <select>
function selectOnChanged() {
  let val = $(".edit-field").val().trim()
  let key = getKey()
  let category = getCategory()
  let yr = getYr()

  if(!checkRowErr(key, yr, category, val)){
    if(key in edits[yr] && 'newDate' in edits[yr][key])
      alert(`Warning: ${val} has conflicts with other roles for ${edits[yr][key]['newDate']}.`)
    else {
      let keyDate = $(`#${yr}-notebook .dates .element${key}`).text()
      alert(`Warning: ${val} has conflicts with other roles for ${keyDate}.`)
    }
  }
  if(!checkColErr(key, yr, category, val)){
    if(key in edits[yr] && 'newDate' in edits[yr][key])
      alert(`Warning: ${val} is assigned consecutively to ${category} on ${edits[yr][key]['newDate']}.`)
    else {
      let keyDate = $(`#${yr}-notebook .dates .element${key}`).text()
      alert(`Warning: ${val} is assigned consecutively to ${category} on ${keyDate}.`)
    }
  }

  //create obj in edits before assigning properties to it
  if(!(key in edits[yr])) edits[yr][key] = {}
  edits[yr][key][category] = val
  $(".edit-field").parent().html(val)
  $("button[name='save-tbl'], button[name='cancel']").show()
}

//each row (same date) cannot have duplicate values for: moderator & (youth | children)
function checkRowErr(key, yr, category, val){
  if(category == "place") return true //place should be omitted from evaluation
  if(val == "Cancelled" || val.trim() == "") return true //"Cancelled" doesn't count as duplicate
  if(category == "youth" || category == "children")
    return $(`#${yr}-notebook .moderator .element${key}`).text() != val
  else if(category == "moderator")
    return $(`#${yr}-notebook .children .element${key}`).text() != val
            && $(`#${yr}-notebook .youth .element${key}`).text() != val
  return true;
}

//each col (same category) cannot have consecutive duplicate values for: moderator, youth, children
function checkColErr(key, yr, category, val){
  if(category == "place") return true //place should be omitted from evaluation
  if(val == "Cancelled" || val.trim() == "") return true //"Cancelled" doesn't count as duplicate
  let [nextKey, prevKey] = [key + 1, key - 1]
  let $nextElem = $(`#${yr}-notebook .${category} .element${nextKey}`),
      $prevElem = $(`#${yr}-notebook .${category} .element${prevKey}`)
  if($nextElem.length && val == $nextElem.text())
    return false
    //return false for error b/c strings are the same, true otherwise
  if($prevElem.length)
    return val != $prevElem.text()
  return true
}

//avoid memory leaks by deleting useless object properties
function deleteObjProp(key, category = undefined){
  if(key in edits[yr]){
    if(Object.keys(edits[yr][key]).length === 0 && edits[yr][key].constructor === Object)
      delete edits[yr][key] //delete the parent object as well if it is now empty
  }
}

// get the year of the table that is being edited
function getYr(){
  return $(".selected-yr").text().trim()
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
  if(str.search(/[^0-9/]/) >= 0) return false
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
