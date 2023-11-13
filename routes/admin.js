var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
 
router.get('/login', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/login');
});
router.get('/', function(req, res, next) {    
    // render to add.ejs
    res.render('admin');
});

router.get('/button', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/button');
});

router.get('/form', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/form');
});

router.get('/table', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/table');
});

router.get('/signup', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/signup');
});
router.get('/signin', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/signin');
});

router.get('/material', function(req, res, next) {    
    // render to add.ejs
    res.render('admin/material');
});

router.get('/show', function(req, res, next) {    
    dbConn.query('SELECT * FROM mat ORDER BY id desc', function (err, rows) {
        if (err) {throw err;}
        else{
        res.render('admin/show_material', {data:rows});
        }
    });
});
router.get('/student', function(req, res, next) {    
    dbConn.query('SELECT * FROM student ORDER BY id desc', function (err, rows) {
        if (err) {throw err;}
        else{
        res.render('admin/student', {data:rows});
        }
    });
});
router.get('/contact', function(req, res, next) {    
    dbConn.query('SELECT * FROM contact ORDER BY id desc', function (err, rows) {
        if (err) {throw err;}
        else{
        res.render('admin/contact', {data:rows});
        }
    });
});
router.post('/student', function(req, res, next) {    
    let sname =req.body.sname;
    let mobile = req.body.mobile;
 
    let email = req.body.email; 
    let course = req.body.course;  
    let sem = req.body.sem; 
    let address = req.body.address;
    let password = req.body.password;  
        
    let errors = false;

    if(sname.length === 0 || mobile.length === 0 || email.length === 0 || course.length === 0 || sem.length === 0 || address.length === 0 || password.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter Matireal Name and Short emailription and Course and Uploaded by");
        // render to add.ejs with flash message
        res.render('admin/student', {
            sname: sname,
            mobile: mobile,
            
            email: email,
            course: course,
            sem: sem,
            address: address,
            password: password
           
            
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            sname: sname,
            mobile: mobile,
            email: email,
            course: course,
            sem: sem,
            address: address,
            password: password
          
           
        }
        
        // insert query
        dbConn.query('INSERT INTO student SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('admin/student', {
                    sname: form_data.sname,
                    mobile: form_data.mobile,
                    email: form_data.email,
                    course: form_data.course,
                    sem: form_data.sem,
                    address: form_data.address,
                    password: form_data.password
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/admin/student');
            }
        })
    }
})
router.get('/sdelete/(:id)', function(req, res, next) {

    let id = req.params.id;
    console.log(id);
     
    dbConn.query('DELETE FROM student WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/admin/student')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/admin/student')
        }
    })
})
router.get('/sedit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM student WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/admin/student')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('admin/upstudent', {
                title: 'Edit material', 
                id: rows[0].id,
                sname: rows[0].sname,
                mobile: rows[0].mobile,
                email: rows[0].email,

                course: rows[0].course,
                sem: rows[0].sem,
                address:rows[0].address,
                
                password:rows[0].password

            })
        }
    })
})
router.post('/sedit/:id', function(req, res, next) {
    let id = req.params.id;
    let sname =req.body.sname;
    let mobile = req.body.mobile;
 
    let email = req.body.email; 
    let course = req.body.course;  
    let sem = req.body.sem; 
    let address = req.body.address;
    let password = req.body.password;  
        
        let errors = false;
    
        if(sname.length === 0 || mobile.length === 0 || email.length === 0 || course.length === 0 || sem.length === 0 || address.length === 0 || password.length === 0) {
            errors = true;
            
            // set flash message
            req.flash('error', "Please enter sname and mobile and course");
            // render to add.ejs with flash message
            res.render('admin/upstudent', {
                id: req.params.id,
                sname: sname,
            mobile: mobile,
            email: email,
            course: course,
            sem: sem,
            address: address,
            password: password
          
            })
        }
    
        // if no error
        if( !errors ) {   
     
            var form_data = {
                sname: sname,
            mobile: mobile,
            email: email,
            course: course,
            sem: sem,
            address: address,
            password: password
          
            
            }
            // update query
            dbConn.query('UPDATE student SET ? WHERE id = ' + id, form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('admin/upstudent', {
                        id: req.params.id,
                        sname: form_data.sname,
                    mobile: form_data.mobile,
                    email: form_data.email,
                    course: form_data.course,
                    sem: form_data.sem,
                    address: form_data.address,
                    password: form_data.password
                    })
                } else {
                    req.flash('success', 'User successfully updated');
                    res.redirect('/admin/student');
                }
            })
        }
    })
      
router.post('/material',upload.single('image'), function(req, res, next) {    

  
        let title = req.body.title;
        let course = req.body.course;
        let sem=req.body.sem;
        let photo="";
       
        if(req.file)
        {
            photo=req.file.filename;   
        }
            
        let errors = false;
    
        if(title.length === 0 || course.length === 0 || sem === 0 ) {
            errors = true;
    
            // set flash message
            req.flash('error', "Please enter Matireal Name and Short Description and Course and Uploaded by");
            // render to add.ejs with flash message
            res.render('admin/material', {
                title: title,
                course: course,
                sem:sem,
            
            })
        }
    
        // if no error
        if(!errors) {
    
            var form_data = {
                title: title,
                course: course,
                sem:sem,
            
                photo:"images/"+photo
                
            }
            
            // insert query
            dbConn.query('INSERT INTO mat SET ?', form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to add.ejs
                    res.render('admin/material', {
                        title: form_data.title,
                        course:form_data.course,
                        sem: form_data.sem
                        
                    })
                } else {                
                    req.flash('success', 'User successfully added');
                    res.redirect('/admin/material');
                }
            })
        }
    })
    router.get('/cdelete/(:id)', function(req, res, next) {

        let id = req.params.id;
        console.log(id);
         
        dbConn.query('DELETE FROM contact WHERE id = ' + id, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // redirect to user page
                res.redirect('/admin/contact')
            } else {
                // set flash message
                req.flash('success', 'User successfully deleted! ID = ' + id)
                // redirect to user page
                res.redirect('/admin/contact')
            }
        })
    })
    router.post('/login2', function(req, res, next) {    

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
                        res.render('admin', );
                     }
                     })           
                    
                }
            })
        }
    })
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
            res.render('admin/signin', {
                email: email,
                password:password
                })
        }
    
    
        // if no error
        if(!errors) {
            dbConn.query('SELECT * FROM student WHERE (student.email=\"'+email+'\"and \ "'+password+'\"=student.password)' , function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                   
                } else {   
                    req.session.isAuth = true;
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
                
                        res.render('admin', {data:rows});
                             
                    
                }
            })
        }
    })
    router.get('/logout',(req,res) => {
        req.session.destroy();
        res.redirect('/admin/login');
    });
    
module.exports = router;