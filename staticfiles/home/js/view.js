$(function() {
  // behavior navigating tabs
  $(".yr-lbl").click(function() {
    let sn = ".selected-notebook"
    $(".selected-yr").removeClass("selected-yr")
    $(this).addClass("selected-yr")
    $(sn).hide()
    let yr = getYr()
    let yrn = `#${yr}-notebook`
    $(sn).removeClass("selected-notebook")
    $(yrn).addClass("selected-notebook")
    $(sn).show()
  })

  let createHover = function(){
    //check condition again in case element property has changed
    if($(this)[0].scrollWidth > Math.ceil($(this).innerWidth())
        && !$(this).has(".edit-field").length){
      $("div.hover").remove()
      $(".info").append(`<div class='hover'>${$(this).text()}</div>`)
      let dest = $(this).eq(0).position()
      $("div.hover").css({
        top: dest.top,
        left: dest.left,
        'max-width': ($(this).width()+50)
      })
    }
  }

  // hover box an element if the text is too wide for the cell
  $(".element").on("click", function(){
    if($("div.hover").length)
      $("div.hover").remove()
    else if($(this)[0].scrollWidth > Math.ceil($(this).innerWidth()) //scrollWidth: int, innerWidth: float
        && !$(this).has(".edit-field").length) // do not activate hover div when edit field is present
      createHover.call(this)
  })

  /*
    remove hover box whenever mouse leaves or is clicked
    (assuming the click means they wish to edit the content of the element itself)
  */
  $(document).on("mouseleave click", "div.hover", () => $("div.hover").remove())
})

// get the year of the table that is being edited
function getYr(){
  return $(".selected-yr").text().trim()
}
