var express = require("express");
var app = express();
var db = require("../models");
//var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");


module.exports = function(app) {

// Routes

// Render Home Page
  app.get("/", function(req, res) {
    

     res.render("home");
 
  });

  // A GET route for scraping the echojs website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.nytimes.com").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("h2.story-heading").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.saved = false;
        result.date = Date.now();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      res.redirect("/");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .sort({date : 1})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    console.log(req.body);
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: {note: dbNote._id} });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  //for saving or unsaving articles
  app.patch("/api/articles", function(req, res) {

      db.Article.update(req.body, function(err, data) {
          //this gets sent back to app.js and the article is either saved or unsaved
          res.json(data);
      });
  });

  //display saved articles
  app.get("/api/saved", function(req, res) {
    db.Article.find({saved : true})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // route for saved article page
  app.get("/saved", function(req, res) {
    res.render("saved");
  });



    app.post("/articlessaved/:id", function(req, res) {
      console.log("We are in articels saved.");
    // Create a new note and pass the req.body to the entry
    db.Article.findOne({ _id: req.params.id })
      .then(function() {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: { saved: true }});
     })
      .then(function(res) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(res);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
      console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
  });


};