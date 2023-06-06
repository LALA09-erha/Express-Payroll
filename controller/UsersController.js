'use strict';

const response = require('../config/response');
const connect = require('../database/connect');
const server = require('../server/server');
const Users = require('../models/UsersModels');
const bcrypt = require('bcrypt');

// view for login
exports.loginview = function(req,res){
    if(req.cookies.user != undefined){
        return res.redirect('/');
    }else{
        res.render('valid/login' , {
            title : "Login",
            layout: 'valid/template/main',
            foto : 'productivity.jpg',
            msg : req.session.massage
        }) ;
    }
}



//api for login / get data user from database by email or username
exports.login = function(req,res){

    if(req.body.email != undefined || req.body.password != undefined){
        
        if(server.validate.validate(req.body.email)){
            connect.connection.query("SELECT * from users where EMAIL=?",[req.body.email],function(error,row,fields){
                if(error){
                    req.session.massage = error;
                    return res.redirect('/login')

                }else{
                    if(row.length>0)
                    {
                        const passhash = bcrypt.compareSync(req.body.password, row[0].PASSWORD);                        
                        if(row[0].PASSWORD == req.body.password || passhash){
                            if(row[0].ROLE =='Admin'){
                                res.cookie('user', row[0].ROLE ,{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                res.cookie('data', row[0] ,{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })        
                                res.cookie('temp',[],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                // console.log(req.cookies.user);
                                req.session.massage = 'Login Sukses!'      
                                return res.redirect('/');
            
                            }else{
                                res.cookie('user', row[0].ROLE ,{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                res.cookie('data', row[0],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })        
                                res.cookie('temp',[],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                req.session.massage = 'Login Sukses!'      
                                return res.redirect('/');
                            }
                        }else{  
                            req.session.massage = 'Login Gagal!'
                            return res.redirect('/login')
                        }
                    }else{
                        req.session.massage = 'Login Gagal!'
                        return res.redirect('/login')
                    }     
                };
            });
        }else{
            connect.connection.query("SELECT * from users where USERNAME=?",[req.body.email],function(error,row,fields){
                if(error){
                    connect.connection.log(error)
                }else{
                    if(row.length>0)
                    {
                        const passhash = bcrypt.compareSync(req.body.password, row[0].PASSWORD);
                        if(row[0].PASSWORD == req.body.password || passhash){
                            if(row[0].ROLE =='Admin'){
                                res.cookie('user', row[0].ROLE ,{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                res.cookie('data', row[0],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                                res.cookie('temp',[],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                req.session.massage = 'Login Sukses!'      
                                // console.log(req.cookies.user);
                                return res.redirect('/');
                                
                            }else{
                                res.cookie('user', row[0].ROLE ,{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                res.cookie('data', row[0],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })        
                                res.cookie('temp',[],{ expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true })
                                req.session.massage = 'Login Sukses!'      
                                return res.redirect('/');
                            }
                        }else{  
                            req.session.massage = 'Login Gagal!'
                            return res.redirect('/login')
                        }
                        
                    }else{
                        req.session.massage = 'Username / Email Tidak Valid'
                        return res.redirect('/login')
                    }     
                };
            });
        }
    }else{
        req.session.massage = 'Username / Password Tidak Boleh Kosong'
        return res.redirect('/login')
        
    }
}

//user view
exports.users = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login');
    }else{
        if(req.cookies.user == 'Admin'){
            connect.connection.query("SELECT * from users",function(error,row,fields){
                if(error){
                    connect.connection.log(error)
                }else{
                    res.render('home/users' , {
                        title : "Home | Users",
                        layout: 'home/tamplate/main',
                        data : req.cookies.data,
                        msg : req.session.massage,
                        users : row
                    }) ;                                         
                };
            });
        }else{
            return res.redirect('/');
        }
    }
}

/// add user view
exports.adduser = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login');
    }else{
        if(req.cookies.user == 'Admin'){
            res.render('home/adduser' , {
                title : "User | Add User",
                layout: 'home/tamplate/main',
                msg : req.session.massage,
                data : req.cookies.data
            }) ;
        }else{
            return res.redirect('/');
        }
    }
}

// edit user view
exports.edituser = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login');
    }else{
        if(req.cookies.user == 'Admin'){
            var id = req.params.id;
            connect.connection.query("SELECT * from users where IDUSER=?",[id],function(error,row,fields){
                if(error){
                    connect.connection.log(error)
                }else{
                    res.render('home/edituser' , {
                        title : "User | Edit User",
                        layout: 'home/tamplate/main',
                        data : req.cookies.data,
                        msg : req.session.massage,
                        user : row[0]
                    }) ;
                };
            });
        }else{
            return res.redirect('/');
        }
    }
}

// proses delete user
exports.deleteuser = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login');
    }else{
        if(req.cookies.user == 'Admin'){
            var id = req.params.id;
            connect.connection.query("DELETE from users where IDUSER=?",[id],function(error,row,fields){
                if(error){
                    connect.connection.log(error)
                }else{
                    req.session.massage = 'Hapus User Sukses!'
                    return res.redirect('/users');
                };
            });
        }else{
            return res.redirect('/');
        }
    }
}



//api for register / insetrt data after regist and validation data
exports.register = function(req,res){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
            
    if(username != undefined || email != undefined || password != undefined){
        if(server.validate.validate(email)){
            // check email already exist or not
            connect.connection.query("SELECT * from users where EMAIL=?",[email],function(error,row,fields){
                if(error){
                    connect.connection.log(error)
                }else{
                    if(row.length>0)
                    {
                        req.session.massage = 'Email Sudah Terdaftar!'
                        return res.redirect('/adduser');
                        
                    }else{
                        // check username already exist or not
                        connect.connection.query("SELECT * from users where USERNAME=?",[username],function(error,row,fields){
                            if(error){
                                connect.connection.log(error)
                            }else{
                                if(row.length>0)
                                {
                                    req.session.massage = 'Username Sudah Terdaftar!'
                                    return res.redirect('/adduser');
                                }else{
                                    const salt = bcrypt.genSaltSync(10);
                                    const hash = bcrypt.hashSync(password, salt);
                                    const created_at = new Date();
                                    const data = {
                                        'USERNAME' :username ,
                                        'EMAIL' : email,
                                        'PASSWORD' : hash, 
                                        'ROLE':role,
                                        'CREATED_AT' : created_at,
                                        'UPDATE_AT' : created_at

                                    }
                                    var insertUser = Users.insert(data);
                                    insertUser.then(function(result){
                                        req.session.massage = 'User Berhasil Terdaftar!'
                                        return res.redirect('/users');
                                    }).catch(function(err){                                        
                                        req.session.massage = 'User Gagal Terdaftar!'
                                        return res.redirect('/adduser');
                                    })
                                }     
                            };
                        }); 
                    }     
                };
            });
        }else{
            
            req.session.massage = 'Email Tidak Valid!'
            return res.redirect('/adduser');
        }
    }else{
        req.session.massage = 'Data Tidak Boleh Kosong!'
        return res.redirect('/adduser');
    }
}

// proses edit user
exports.prosesedit = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login');
    }else{
        if(req.cookies.user == 'Admin'){
            connect.connection.query("SELECT * from users where IDUSER=?",[req.body.iduser],function(error,row,fields){
                if(error){
                    connect.connection.log(error)
                }else{
                    if(req.body.email == row[0].EMAIL && req.body.username == row[0].USERNAME && req.body.password == row[0].PASSWORD && req.body.role == row[0].ROLE){
                        req.session.massage = 'Data Tidak Berubah!'
                        return res.redirect('/users');
                    }else{
                        connect.connection.query("SELECT * from users where EMAIL=?",[req.body.email],function(error,row,fields){
                            if(error){
                                connect.connection.log(error)
                            }else{
                                if(row.length>0)
                                {
                                    if(row[0].IDUSER != req.body.iduser){
                                        req.session.massage = 'Email Sudah Terdaftar!'
                                        return res.redirect('/edituser/'+req.body.iduser);}
                                    else{
                                        connect.connection.query("SELECT * from users where USERNAME=?",[req.body.username],function(error,row,fields){
                                            if(error){
                                                connect.connection.log(error)
                                            }else{
                                                if(row.length>0)
                                                {
                                                    if(row[0].IDUSER != req.body.iduser){
                                                            
                                                        req.session.massage = 'Username Sudah Terdaftar!'
                                                        return res.redirect('/edituser/'+req.body.iduser);
                                                    }else{
                                                        if(req.body.password != row[0].PASSWORD){
                                                            const salt = bcrypt.genSaltSync(10);
                                                            const hash = bcrypt.hashSync(req.body.password, salt);
                                                            const data = {
                                                                'USERNAME' :req.body.username ,
                                                                'EMAIL' : req.body.email,
                                                                'PASSWORD' : hash, 
                                                                'ROLE':req.body.role                                
                                                            }
                                                            connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                                if(error){
                                                                    connect.connection.log(error)
                                                                }else{
                                                                    req.session.massage = 'Edit User Sukses!'
                                                                    return res.redirect('/users');
                                                                };
                                                            });
                                                        }else{
                                                            const data = {
                                                                'USERNAME' :req.body.username ,
                                                                'EMAIL' : req.body.email,
                                                                'ROLE':req.body.role                                
                                                            }
                                                            connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                                if(error){
                                                                    connect.connection.log(error)
                                                                }else{
                                                                    req.session.massage = 'Edit User Sukses!'
                                                                    return res.redirect('/users');
                                                                };
                                                            });
                                                        }
                                                    }
                                                }else{
                                                    if(row[0] != undefined){
                                                        if(req.body.password != row[0].PASSWORD){
                                                            const salt = bcrypt.genSaltSync(10);
                                                            const hash = bcrypt.hashSync(req.body.password, salt);
                                                            const data = {
                                                                'USERNAME' :req.body.username ,
                                                                'EMAIL' : req.body.email,
                                                                'PASSWORD' : hash, 
                                                                'ROLE':req.body.role                                
                                                            }
                                                            connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                                if(error){
                                                                    connect.connection.log(error)
                                                                }else{
                                                                    req.session.massage = 'Edit User Sukses!'
                                                                    return res.redirect('/users');
                                                                };
                                                            });
                                                        }
                                                    }else{
                                                        const data = {
                                                            'USERNAME' :req.body.username ,
                                                            'EMAIL' : req.body.email,
                                                            'ROLE':req.body.role                                
                                                        }
                                                        connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                            if(error){
                                                                connect.connection.log(error)
                                                            }else{
                                                                req.session.massage = 'Edit User Sukses!'
                                                                return res.redirect('/users');
                                                            };
                                                        });
                                                    }
                                                }
                                            };
                                        });
                                    }
                                }else{
                                    connect.connection.query("SELECT * from users where USERNAME=?",[req.body.username],function(error,row,fields){
                                        if(error){
                                            connect.connection.log(error)
                                        }else{
                                            if(row.length>0)
                                            {
                                                if(row[0].IDUSER != req.body.iduser){
                                                    req.session.massage = 'Username Sudah Terdaftar!'
                                                    return res.redirect('/edituser/'+req.body.iduser);
                                                }else{
                                                    if(req.body.password != row[0].PASSWORD){
                                                        const salt = bcrypt.genSaltSync(10);
                                                        const hash = bcrypt.hashSync(req.body.password, salt);
                                                        const data = {
                                                            'USERNAME' :req.body.username ,
                                                            'EMAIL' : req.body.email,
                                                            'PASSWORD' : hash, 
                                                            'ROLE':req.body.role                                
                                                        }
                                                        connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                            if(error){
                                                                connect.connection.log(error)
                                                            }else{
                                                                req.session.massage = 'Edit User Sukses!'
                                                                return res.redirect('/users');
                                                            };
                                                        });
                                                    }else{
                                                        const data = {
                                                            'USERNAME' :req.body.username ,
                                                            'EMAIL' : req.body.email,
                                                            'ROLE':req.body.role                                
                                                        }
                                                        connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                            if(error){
                                                                connect.connection.log(error)
                                                            }else{
                                                                req.session.massage = 'Edit User Sukses!'
                                                                return res.redirect('/users');
                                                            };
                                                        });
                                                    }
                                                }
                                            }else{
                                                if(req.body.password != row[0].PASSWORD){
                                                    const salt = bcrypt.genSaltSync(10);
                                                    const hash = bcrypt.hashSync(req.body.password, salt);
                                                    const data = {
                                                        'USERNAME' :req.body.username ,
                                                        'EMAIL' : req.body.email,
                                                        'PASSWORD' : hash, 
                                                        'ROLE':req.body.role                                
                                                    }
                                                    connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                        if(error){
                                                            connect.connection.log(error)
                                                        }else{
                                                            req.session.massage = 'Edit User Sukses!'
                                                            return res.redirect('/users');
                                                        };
                                                    });
                                                }else{
                                                    const data = {
                                                        'USERNAME' :req.body.username ,
                                                        'EMAIL' : req.body.email,
                                                        'ROLE':req.body.role                                
                                                    }
                                                    connect.connection.query("UPDATE users SET ? where IDUSER=?",[data,req.body.iduser],function(error,row,fields){
                                                        if(error){
                                                            connect.connection.log(error)
                                                        }else{
                                                            req.session.massage = 'Edit User Sukses!'
                                                            return res.redirect('/users');
                                                        };
                                                    });
                                                }
                                            }
                                        };
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        else{
            return res.redirect('/');
        }
    }

}




exports.saveemail = function(req,res){
    const email = req.body.email;
    const iduser = req.body.iduser;
    if(email != undefined){
        if(server.validate.validate(email)){
            // check email already exist or not
            connect.connection.query("SELECT * from email_fav where EMAIL=?",[email],function(error,row,fields){
                if(error){
                    response.error(error,res);
                }else{
                    if(row.length>0)
                    {
                        response.error("Email Already Exist" , res);
                    }else{
                        const data = {
                            'EMAIL' : email,
                            'IDUSER': iduser
                        }
                        var insertUser = Users.insertemail(data);
                        insertUser.then(function(result){
                            response.ok(result , res);
                        }).catch(function(err){
                            response.error(err,res);
                        })
                    }     
                };
            });
        }else{
            response.error("Email Tidak Valid",res);
        }
    }else{
        response.error("Email Tidak Boleh Kosong",res);
    }
}


exports.getemail = function(req,res){
    var iduser = req.params.iduser;
    console.log(iduser , "iduser")
    if(iduser != undefined){
        connect.connection.query("SELECT * from email_fav where IDUSER=?",[iduser],function(error,row,fields){
            if(error){
                response.error(error,res);
            }else{
                if(row.length>0)
                {
                    var list_data = [];
                    for(i=0;i<row.length;i++){
                        list_data.push(row[i].EMAIL)
                    }
                    
                    response.ok(list_data, res);
                }else{
                    response.error("Email Not Found" , res);
                }     
            };
        });
    }else{
        response.error("Id User Tidak Boleh Kosong",res);
    }
} 

exports.logout = function(req,res){
    res.clearCookie('user');
    res.clearCookie('data');
    res.clearCookie('temp');
    req.session.massage = 'Logout Success'
    return res.redirect('/login')
}