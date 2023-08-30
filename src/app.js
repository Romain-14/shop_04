const express = require("express");
const session = require("express-session");
const bcrypt  = require("bcrypt");
const fs      = require("fs");

// lors d'un require, on a un JSON.parse() implicite
const datas     = require("./data/products.json"); 
const usersList = require("./data/users.json");

const randomNumber = require("./utils/index.js");

const app = express();
const PORT = 9000;
const SALT_ROUND = 10;

app.set("views", "./src/views")
   .set("view engine", "ejs")
   .use(express.static("public"))
   .use(express.urlencoded({extended: true}))
   .use(session({
        secret: "Jxd1ktmDaHByoQ4r0KpIQ028EVjyqqfm",
        resave: false,
        saveUninitialized: false,
    }))
    .use((req, res, next)=> {
        if( !req.session.user ){
            req.session.user = { isLogged : false, email : null }
        }
        next();
});

app.get("/", (req, res) => {
    const randomDatas = [...datas];
    const datasToDisplay = 3;
    for (let i = 0; i < datas.length - datasToDisplay ; i++) {
        const index = randomNumber(0, randomDatas.length -1);
        randomDatas.splice(index, 1 );
    }
    res.status(200).render("layout", {template: "./home", randomDatas, user: req.session.user });
});

app.get("/product", (req, res) => {      
    res.status(200).render("layout", {template: "./product/all", datas, user: req.session.user });
});

app.get("/product/:id", (req, res) => {
    const data = datas.find((data) => data.id === parseInt(req.params.id));

    res.status(200).render("layout", {template: "./product/one", data, user: req.session.user });
});

app.get("/search", (req, res) => {  
    const search = datas.filter((data) => data.label.toLowerCase().includes(req.query.search.toLowerCase()));

    res.status(200).render("layout", {template: "./search", search, user: req.session.user});
});

app.post("/search", (req, res) => {    
    res.redirect(`/search?search=${req.body.search}`);
});

// USER
app.get("/user/signin", (req, res) => {
    const {msg} = req.query;

    res.status(200).render("layout", {template: "./user/signin", user: req.session.user, msg});
});

app.post("/user/signin", (req, res) => {
    if(!req.body.email || !req.body.password) {
        res.redirect("/user/signin?msg=Pas%20de%20champs%20vide%20!");
        return;
    }

    // sans import du json en haut de ce fichier on passe par la méthode readfile mais on doit "parse"
    // fs.readFile("src/data/users.json", "utf8", (err, data) => {
    //     const usersList = JSON.parse(data);
        const user = usersList.find(user => req.body.email === user.email);
        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if(err) return console.log("compare", err);
                if(same) {
                    req.session.user = { isLogged: true, email: req.body.email };
                    res.redirect("/");
                } else {
                    res.redirect("/user/signin?msg=Mot%20de%20passe%20erroné%20!%20Contactez%20l'administrateur%20!")
                }
            });
        } else res.redirect("/user/signin?msg=Email%20inconnu%20!");

    // });
});

app.get("/user/signup", (req, res) => {
    res.status(200).render("layout", {template: "./user/signup", user: req.session.user});
});

app.post("/user/signup", (req, res) => {
    if(!req.body.email || !req.body.password) {
        res.redirect("/user/signup");
        return;
    };        

    // sans import du json en haut de ce fichier on passe par la méthode readfile mais on doit "parse"
    // fs.readFile("src/data/users.json", "utf8", (err, data) => {
    //     if(err) return console.log("readfile", err);
        
        // const usersList = JSON.parse(data);
        
        const user = {
            id: usersList.length ? Math.max(...usersList.map(user => user.id)) + 1 : 1,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, SALT_ROUND),
            signup_date: new Date(),
        }

        usersList.push(user);

        fs.writeFile("src/data/users.json", JSON.stringify(usersList), (err) => {
            if(err) return console.log("writefile",err);

            res.redirect("/user/signin");
        });
    // });

});

app.get("/user/signout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));