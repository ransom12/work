var mysql = require('mysql');
var express = require("express")
var bodyparse = require("body-parser")
var session = require('express-session');
var app = express()
var router = express.Router();

app.use(bodyparse.urlencoded({ extended: true }));
app.use(session({ secret: "Shh, its a secret!" }));
app.use(express.static('./public/'))

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gallery"
})
var con1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "blogging"
})
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", (req, res) => {

    conn.query("SELECT * FROM gallery_images", function(err, data, fields) {
        if (err) throw err;
        res.render('index', { title: 'Homepage', userData: data });
    })

})
app.get("/about", (req, res) => {
    res.render("about_us", { title: "About us" })
})
app.get("/login", (req, res) => {
    res.render("login", { title: "Login", msg: "" })

})
app.post('/login_try', function(req, res) {

    var mail = req.body.email;
    var pass1 = req.body.pass;
    con1.query('SELECT * FROM blog_register WHERE user_email = ? AND user_pass = ?', [mail, pass1], function(error, results, fields) {
        if (results.length > 0) {
            req.session.user_id = results[0].id
            res.redirect('/');
        } else {
            res.render("login", { msg: "Email or Password Wrong" })
        }

    })
})
app.listen(3000, function() {
    console.log("server Running http://localhost:3000/")
});
module.exports = router;