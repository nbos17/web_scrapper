  $.getJSON("/api/saved", function(data) {
    console.log("new page");
    console.log(data.length);
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$(document).on("click", "#home", function() {
	location.href = "/";
});