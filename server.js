const EXPRESS = require("express");
const APP = EXPRESS();
const PORT = 9000;
const SERVER = APP.listen(PORT, (req, res) => {
	console.log(`server is listening to port ${PORT}`);
});
const IO = require("socket.io")(SERVER);

let bodyParser = require("body-parser");
let session = require("express-session");
APP.use(bodyParser.urlencoded({ extended: true }));

APP.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 600000 },
	})
);

// for image/js/css
APP.use(EXPRESS.static(__dirname + "/static"));
// This sets the location where express will look for the ejs views
APP.set("views", __dirname + "/views");
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
APP.set("view engine", "ejs");
// use app.get method and pass it the base route '/' and a callback

IO.on("connection", function (socket) {
	// console.log(`a user is connected`);

	// socket.emit("new_connection", { msg: "this user is now connected" });
	socket.broadcast.emit("other_user_connection", { msg: `user with socket id ${socket.id} is connected` });

	socket.on("new_connection", function (data) {
		console.log(data.msg);

		// socket.broadcast.emit("color", { data: color });
	});

	socket.on("notify", function () {
		console.log(`user with socket id ${socket.id} has clicked the button`);
		socket.broadcast.emit("trigger-button", { msg: `user with socket id ${socket.id} has clicked the button` });
	});

	// socket.emit("trigger-button", { msg: `user with socket id ${socket.id} has clicked the button` });

	socket.on("disconnect", function () {
		socket.broadcast.emit("other_user_disconnected", { msg: `user with socket id ${socket.id} is disconnected` });
		console.log(`user with socket id ${socket.id} is disconnected`);
	});
});

APP.get("/", (req, res) => {
	res.render("index");
});

APP.post("/add-user-to-chat-room", (req, res) => {
	res.json({ msg: "new user has join the chat room", name: req.body.name });
});

// APP.listen(PORT, (req, res) => {
// 	console.log(`Server is listening to ${PORT}`);
// });
