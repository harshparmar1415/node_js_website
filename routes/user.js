var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
const multer = require('multer')
const path = require('path')


router.get('/', function(req, res, next) {    
    // render to add.ejs
    res.render('user');
});

router.get('/about', function(req, res, next) {    
    // render to add.ejs
    res.render('user/about');
});
router.get('/new', function(req, res, next) {    
    // render to add.ejs
    res.render('user/newl');
});
router.get('/contact', function(req, res, next) {    
    // render to add.ejs
    res.render('user/contact');
});
router.get('/course', function(req, res, next) {    
    // render to add.ejs
    res.render('user/course');
});
router.get('/teacher', function(req, res, next) {    
    // render to add.ejs
    res.render('user/teacher');
});
router.get('/login', function(req, res, next) {    
    // render to add.ejs
    res.render('user/newl');
});
router.post('/login', function(req, res, next) {    

    let email = req.body.email;
    let password = req.body.password;
    
    // console.log(uname);
    // console.log(course);
    let errors = false;

    if(email.length === 0 || password.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter the details");
        // render to add.ejs with flash message
        res.render('user/login', {
            email: email,
            password:password
            })
    }


    // if no error
    if(!errors) {
        dbConn.query("SELECT * FROM student WHERE email='"+email+"'  " , function(err, rows, fields) {
            //if(err) throw err
            if (err) {
               
            } else {   
                console.log(rows[0].course); 
                req.session.user=email;
                req.session.course=rows[0].course;
                req.session.name=rows[0].sname;
                console.log(req.session.user); 
                console.log(req.session.course); 
                res.locals.name=req.session.name;
             //  // req.session.password=password;
                //req.locals.course=req.session.course;

                console.log(req.session.name); 
               // console.log(req.locals.course); 
             
                 dbConn.query("SELECT * FROM mat WHERE course='"+req.session.course+"' ",function(err,rows2,fields){
                  //  dbConn.query("SELECT * FROM mat ",function(err,rows,fields){
                    if (err) {throw err;}
                    else{req.flash('success', 'login success');
                    res.render('user/show2', {data:rows2});
                 }
                 })           
                
            }
        })
    }
})
router.get('/show2', function(req, res, next) { 

    dbConn.query("SELECT * FROM student WHERE email='"+req.session.user+"'  " , function(err, rows, fields) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
           
        } else {   

  
    dbConn.query("SELECT * FROM mat WHERE course='"+req.session.course+"' ",function(err,rows2,fields){
        //  dbConn.query("SELECT * FROM mat ",function(err,rows,fields){
          if (err) {throw err;}
          else{req.flash('success', 'login success');
          res.render('user/show2', {data:rows2});
       }
       })  
    }
})   
    
});

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/user/login');
});
router.post('/contact', function(req, res, next) {    

    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.subject;
    
    let message=req.body.message
 
        
    let errors = false;

    if(name.length === 0 || email.length === 0 || subject === 0 || message.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter Matireal Name and Short Description and subject and Uploaded by");
        // render to add.ejs with flash message
        res.render('user/contact', {
            name: name,
            email: email,
            subject:subject,
            message:message
            
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            email: email,
            subject:subject,
            
            message:message
        }
        
        // insert query
        dbConn.query('INSERT INTO contact SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('user/contact', {
                    name: form_data.name,
                    email: form_data.email,
                    subject:form_data.subject,
                    message:form_data.message
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/user/contact');
            }
        })
    }
})

module.exports = router;