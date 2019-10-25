require("dotenv").config();

const routes = require("./routes");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

const PORT = process.env.PORT || 3001;

io.on("connection", client => {
	client.on("notifyUser", () => {
	  console.log("saving account data to mongo...");
	  client.emit("timer", new Date());
	});
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
}

const jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),
	audience: process.env.REACT_APP_AUTH0_AUDIENCE,
	issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
	algorithms: ["RS256"],
});

//app.use(jwtCheck);

app.use(routes);

app.get("/public", (req, res) => {
	res.json({
		message: "hello from public api",
	});
});

// app.get("/private", jwtCheck, (req, res) => {
// 	res.json({
// 		message: "hello from private api",
// 	});
// });

// app.get("/findata",checkScope(["read:findata"]), (req, res) => {
// 	res.json({
// 		findata: [
// 			{ id: 1, title: "this is a test find data line1" },
// 			{ id: 2, title: "this is a test find data line2" },
// 			{ id: 3, title: "this is a test find data line3" }
// 		],
// 		message: "hello from findata api",
// 	});
// });

// function checkRoles(role){
// 	return function (req, res, next) {
// 		const assignedRoles = req.user["https://localhost:3000/roles"];
// 		if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
// 			return next();
// 		}
// 		else {
// 			return res.status(401).send("insufficient role");
// 		}
// 	};
// };

// app.get("/admin", checkRoles("admin"), (req, res) => {
// 	res.json({
// 		message: "hello from admin api",
// 	});
// });


server.listen(PORT, function() {
	console.log(
		"==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
		PORT,
		PORT
	);
});
