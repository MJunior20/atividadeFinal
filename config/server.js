const express = require('express');
const app = express();
const expressSession = require('express-session');
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

app.use(expressSession({
    secret: "teste",
    resave: false,
    saveUninitialized: false
}));
app.listen(port, ()=>{
    console.log("Servidor na porta 3000");
});
module.exports = app;