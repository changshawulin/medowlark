/**
 * Created by Administrator on 2018/2/26.
 */

var express = require('express');
var handlebars = require("express3-handlebars").create({defaultLayout: "main"});

var app = express();

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 8090);

app.get("/", (req, res) => res.render("home"));


const fortunes = [
    "1", "2", "3", "4", "5"
];

app.get("/about", (req, res) => {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render("about", {fortune: randomFortune});
});

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
