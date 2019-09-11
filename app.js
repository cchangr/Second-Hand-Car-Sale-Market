var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// from AuthDemo
var passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user");

// ======================
// passport configuration
// ======================
app.use(require("express-session")({
	secret: "Limits, fears etc., are nothing but illusions",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// other configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// local MongoDB
// mongoose.connect("mongodb://localhost/yelp_camp");
// MongoLab url
// mongodb://haobo:password@ds135912.mlab.com:35912/boston_secondhand_store
// mongoose.connect("mongodb://haobo:password@ds135912.mlab.com:35912/boston_secondhand_store");
var database_url = `mongodb://127.0.0.1:27017/web_project_test`;
mongoose.connect(database_url);

// Seed the initial data
// seedDB();

// This middleware makes currentUser available on every single page
// saving the need to add currentUser manually to every page
app.use(function(req, res, next){
	res.locals.currentUser = req.user;

	// Makes the message in the header.ejs available
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


// ====================
// using express router
// ====================
var indexRoutes = require("./routes/index");
var campgroundsRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
// There routes MUST be after all the configuration,
// just like when all the complete routes and logic are here.
app.use(indexRoutes);
app.use(commentsRoutes);
app.use(campgroundsRoutes);
// To further shortern the code can do this
// but need to do some change at the top ./routes/comments.ejs
// i.e., change 
// app.use("/", indexRoutes);
// app.use("/campgrounds", campgroundsRoutes);
// app.use("/campgrounds/:id/comment", commentsRoutes);

// 404 error
app.get("*", function(req, res){
	res.render("page404");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running...");
});
