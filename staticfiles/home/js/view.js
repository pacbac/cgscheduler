$(document).ready(function() {
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
})

// get the year of the table that is being edited
function getYr(){
  return $(".selected-yr").text().trim()
}
