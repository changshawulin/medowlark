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

app.get("/", (req, res) => res.render("home"));


app.get("/about", (req, res) => res.render("about", {fortune: fortune.getFortune()}));

app.use(express.static(__dirname + "/public"));

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
