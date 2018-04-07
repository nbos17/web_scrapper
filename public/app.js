// Grab the articles as a json


$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

    // Display the apropos information on the page
    $("#articles").append("<div class='mainNews' id='" + i + "'>" 
      + "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "</p>" + "<a href='" + data[i].link + " '>" + data[i].link + "</a>" 
      + "<br />" + "<button id='save-article' class = 'btn btn-primary' data-id='" 
      + data[i]._id +"' value='"+ i +"'>Save Article</button>"  
      + "<button id='noteSave' class='btn btn-secondary' data-id='" 
      + data[i]._id + "'>Create Note</button>" + "</div>");

    if (data[i].saved === true) {
      $("#" + i).css("background-color", "white");
    }
  }
});


$(document).on("click", "#scrape", function() {
  console.log("clicked");
  $.ajax({
    method: "GET",
    url :  "/scrape"
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});


//close note 
$(document).on("click", "#closeNote", function() {
  $("#noteCard").css("display", "none");
});



// Whenever someone clicks an article
$(document).on("click", "#noteSave", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#noteCard").css("display", "block");
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      //$("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button id='closeNote'>Close</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        //$("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: thisId,
      // Value taken from note textarea
      body: $("#bodyinput").val(),
      articleID : thisId
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $('#notes').empty();
      $("#noteCard").css("display", "none");
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#save-article", function() {

  var id = $(this).val();
  console.log(id);
  $("#" + id).css("background-color", "white");

  console.log("click");
  var articleToSave = $(this).attr("data-id");
  console.log(articleToSave)
  $.ajax({
    method : "POST",
    url: "/articlessaved/" + articleToSave,
    data : {
      id : articleToSave
    }
  }).then(function(data) {
    console.log(data);
    //location.reload();
  });


});  
      
$(document).on("click", "#savedArticles", function() {

  console.log("click");

  location.href = "/saved";

});