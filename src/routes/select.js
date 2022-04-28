const express = require('express');
const req = require('express/lib/request');
const passport = require('passport');
const { commit } = require('../database');
const router = express.Router();

const conn = require('../database');


// Login inicial
router.get('/', (req,res) =>{
    res.render('login.ejs');
});
router.post('/login',passport.authenticate('local',{
    successRedirect: "/logged",
    failureRedirect: "/"
}));





//QUERY informacion proyecto

router.get('/proyecto', (req,res,next) => {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
},(req,res) =>{
    res.render('proyecto.ejs');
});

router.post('/proyecto', (req,res) => {
    const {Nombre,Area}=req.body;
    conn.query('insert into proyecto SET?',{
        NombreP:Nombre,
        ID: 1,
        Area:Area 
    },(err,resp,campos) =>{
        if(!err) {
            res.redirect('/riesgos');
          } else {
            console.log(err);
          }
    });
});





// QUERY informacion de riegos


router.get('/riesgos', (req,res,next) => {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
},(req,res) =>{
    //res.render('index.ejs');
    conn.query('SELECT * FROM proyecto ORDER BY ID_P DESC LIMIT 1', (err,resp,campos) => {
            console.log(resp);
            res.render('riesgos.ejs',{
            ID : resp
            });
        });
    });

router.post('/riesgos', (req,res) => {
    const {NombreR,Descripcion,Probabilidad,Impacto,Tipo,ID_P}=req.body;
    conn.query('insert into riesgos SET?',{
        Nombre:NombreR,
        Descripcion:Descripcion,
        Probabilidad:Probabilidad,
        Impacto:Impacto,
        Tipo:Tipo,
        ID_P:ID_P 
    },(err,resp,campos) =>{
        if(!err) {
            res.redirect('/riesgos');
          } else {
            console.log(err);
          }
    });
});




// Pantalla Principal

router.get('/logged', (req,res,next) => {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
},(req,res) =>{
    //res.render('index.ejs');
    conn.query('Select NombreP,Area,ID_P FROM Proyecto', (err,resp,campos) => {
            res.render('logged.ejs',{
            datos : resp
            });

        },(err,resp,campos) =>{
            if(!err) {
                res.redirect('/logged');
              } else {
                console.log(err);
              }
        });
    });

router.get('/delete/:ID_P',(req,res)=> {
        const { ID_P } = req.params;
        conn.query('DELETE FROM proyecto WHERE ID_P=?',[ID_P],(err,resp,campos)=>{
            if(!err){
                res.redirect('/logged');
            }else{
                console.log(err);
            }
            });
        });
// Pantalla del analisis
router.get('/analisis/:ID_P',(req,res,next) =>{
    if(req.isAuthenticated()) return next();
    res.redirect('/');
},(req,res) =>{
    const {ID_P} = req.params;
    conn.query('SELECT * FROM riesgos WHERE ID_P=?',[ID_P], (err,resp,campos) => {
        console.log(resp);
        res.render('analisis.ejs',{
        datos : resp
        });
    });
})

// router.post('/',(req,res) => {
//     conn.query('insert into Formulario (nombre,Telefono,Email) values ("Celso cisternas","958431293","Celsitodelflow@email.com")',(err,resp,campos)=>{
//         if(!err){
//              res.json({status: "Contenido Insertado" });
//         }
//         else{
//             console.log(err);
//         }

// });




module.exports = router;
