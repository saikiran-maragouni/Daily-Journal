
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const ld = require("lodash");
const mongoose = require("mongoose");

require("dotenv").config();
const port = process.env.PORT || 3000;

const homeStartingContent = "Welcome to DAILY JOURNAL We are mainly aims to provide a informative and engaging content. Our blog covers a wide range of topics, we are passionate about [niche/topic] and we believe that knowledge is power. That's why we have made it our mission to share our knowledge and insights with our readers, so that they can stay informed and make better decisions.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// for avoiding the deprecating warning
mongoose.set('strictQuery', true);
// connection to the mongodb port server

const connectDB = async () => {
  try {
    mongoose.connect("mongodb+srv://"+process.env.ADMIN_NAME+":"+process.env.ADMIN_PASS+"@cluster1.prd7izq.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});
   
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log("NEW ERROR JAGG " + error);
    process.exit(1);
  }
}

// let posts=[];   instead of this i used the database
const postSchema = {
  title: String,
  body: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find().then(posts => {
    res.render("home", {
      StartingContent: homeStartingContent,
      posts: posts
    });
  });

});



app.get("/about", function (req, res) {
  res.render("about", { aboutcontent: aboutContent });
});


app.get("/contact", function (req, res) {
  res.render("contact", { contactcontent: contactContent });
});


app.get("/compose", function (req, res) {
  Post.find().then(posts => {
    res.render("compose", { contactcontent: posts });
  });
  // res.render("compose", { contactcontent: posts });

});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postContent
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:topic", function (req, res) {
  Post.find().then(posts => {
    posts.forEach(function (pt) {
      if (ld.lowerCase(pt.title) === ld.lowerCase(req.params.topic)) {
        res.render("post", {
          titled: pt.title,
          content: pt.body
        });
      }
    });
  });
  
});

connectDB().then(() => {
  if (port == null || port == "") {
    port = 3000
}
  app.listen(port, () => {
    console.log("JAGG listening for requests");
  });
});
