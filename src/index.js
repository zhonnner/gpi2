

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const conn = require('./database.js');
const PassportLocal = require('passport-local').Strategy;

//config

app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views')); 
app.set('view engine','ejs');
//Middleware
app.use(express.json()); //Transfomar a formato JSON 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('el secreto'));
app.use(session({
     secret: 'el secreto',
     resave: true, //la sesión se guardar cada vez
     saveUninitialized: true    //Si inicializamos y no le guardamos nada igual va a guardar
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username,password,done){
    conn.query('select * From usuario Where Nombre=? and Contrasena=?',[username,password],(err,resp,campos)=>{
    try{ 
        var user;
        var pass;

        if(resp==null){
            user="xdxd";
            pass="xdxd";
        }
        else{
            user = resp[0].Nombre;
            pass = resp[0].Contrasena;
        }

    if(username === user && password === pass){
        console.log(resp);
     return done(null,{id:resp[0].Nombre, name: resp[0].Nombre});
    }
}catch(e){
    done(null,false);
}})
    
     
}));

//Serialización, parar la información para identificar usuario en passport
passport.serializeUser(function(user,done){
     done(null,user.id);
});
//Deserializacion
passport.deserializeUser(function(id,done){
     done(null, {id:1, name: "Manuel"})
});

// rutas
app.use(require('./routes/select.js'));


//SOLO USAR DROP AL FINAL O PRODUCIRA PROBLEMAS CON LA TABLA A ELIMINAR POR LOS DATOS


app.listen(app.get('port'),()=> {
    console.log('Servidor en puerto' ,app.get('port'))
});