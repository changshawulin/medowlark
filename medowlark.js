/**
 * Created by Administrator on 2018/2/26.
 */

var express = require('express');
var fortune = require("./lib/fortune");

var app = express();

var handlebars = require("express3-handlebars").create({
    defaultLayout: "main",
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 8090);

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
    res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
    next();
});

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)'
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)'
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)'
            }
        ]
    };
}

app.use((req, res, next) => {
    if(!res.locals.partials) {
        res.locals.partials = {};
    }
    res.locals.partials.weatherContext = getWeatherData();
    next();
});

app.use(require("body-parser")());

app.get("/", (req, res) => res.render("home"));

app.get("/home", (req, res) => res.render("home"));
app.get("/weather", (req, res) => res.render("weather-show"));

app.get("/about", (req, res) => {
    res.render("about", {
        fortune: fortune.getFortune(),
        pageTestScript: "/qa/tests-about.js"
    })
});

app.get("/newsletter", (req, res) => res.render("newsletter", {csrf: "CSRF token gose here"}));

app.post("/process", (req, res) => {
    if(req.xhr || req.accepts('json,html')==='json'){
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
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
