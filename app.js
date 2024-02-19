const express = require("express");
const bodyParser = require("body-parser");
const lodash = require('lodash');
const mongoose = require('mongoose');
require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//const posts = [];
const port = process.env.PORT || 3000;
const mongoAtlasUsername = process.env.MONGO_USERNAME;
const mongoAtlasPassword = process.env.MONGO_PASSWORD;
const mongoAtlasCluster = process.env.MONGO_CLUSTER;
const mongoDbName = process.env.MONGO_DB_NAME;
const mongoAtlasUrl = `mongodb+srv://${mongoAtlasUsername}:${mongoAtlasPassword}@${mongoAtlasCluster}.mongodb.net/${mongoDbName}`;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const journalSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }
);
const Journal = mongoose.model('Journal', journalSchema);

app.get("/", (req, res) => {
    Journal.find()
        .then( journals => {
            res.render('home', 
                        {
                            startingContent: homeStartingContent,
                            contents: journals
                        }
            );
        })
        .catch( err => {
            console.log(err);
        });
});

app.get("/about", (req, res) => {
    res.render('about', {startingContent: aboutContent});
});

app.get("/contact", (req, res) => {
    res.render('contact', {startingContent: contactContent});
});

app.route("/compose")
    .get( (req, res) => {
        res.render('compose');
    })
    .post((req, res) => {
        const newJournal = new Journal({
            title: req.body.postTitle,
            content: req.body.postBody
        });

        newJournal.save()
            .then( () => {
                console.log('Journal saved');
                res.redirect('/');
            })
            .catch( err => {
                console.log(err);
            });
        
        //posts.push(post);    
    });

app.get("/posts/:postId", (req, res) => {
    const postId = req.params.postId;

    Journal.findById(postId)
        .then( journal => {
            res.render('post', {post: journal});
        })
        .catch( err => {
            console.log(err);
        });

    // posts.forEach((post) => {
    //     if ( lodash.kebabCase(req.params.postTitle) === lodash.kebabCase(post.title) ) postContent = post;
    // });

    // res.render('post', {post: postContent});
});

mongoose.connect(mongoAtlasUrl)
    .then( () => {
        console.log('Connected to Mongo DB');
        app.listen(3000, function() {
            console.log(`Server started on port ${port}`);
        });
    })
    .catch( err => {
        console.log(err);
    });
