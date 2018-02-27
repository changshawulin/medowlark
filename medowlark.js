/**
 * Created by Administrator on 2018/2/26.
 */

var express = require('express');
var handlebars = require("express3-handlebars").create({defaultLayout: "main"});

var fortune = require("./lib/fortune");

var app = express();

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 8090);

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
    res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
    next();
});

app.get("/", (req, res) => res.render("home"));

app.get("/about", (req, res) => {
    res.render("about", {
        fortune: fortune.getFortune(),
        pageTestScript: "/qa/tests-about.js"
    })
});

app.get("/tours/hood-river", (req, res) => res.render("tours/hood-rivers"));

app.get("/tours/request-group-rate", (req, res) => res.render("tours/request-group-rate"));

//定制404页面
app.use((req, res, next) => {
    res.status(404);
    res.render("404");
});

//定制500页面
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), () =>
    console.log(`Express started on http://loacalhost:${app.get("port")}; press Ctrl-c to terminate.`)
);
