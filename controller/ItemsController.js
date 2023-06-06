'use strict';

const response = require('../config/response');
const connect = require('../database/connect');
const server = require('../server/server');
const Items = require('../models/ItemsModels');
const nodemailer = require("nodemailer");
const Moment = require('moment');
const { validate } = require('email-validator');
const { check } = require('express-validator');
const { title } = require('errorhandler');

//untuk mengecek apakah rest api berjalan
exports.index = function(req,res){
    // //console.log(req.cookies)
    if(req.cookies.user == undefined){
        return res.redirect('/login')
    }
    else{
        // mengambil data email_fav dari database berdasarkan iduser
        var iduser = req.cookies.data.IDUSER;
        var showemailfav = Items.getemailbyiduser(iduser);
        showemailfav.then(function(result){
            // //console.log(result)
            return res.render('home/index' ,{
                title : "Dashboard",
                layout : 'home/tamplate/main',
                msg :req.session.massage,
                data : req.cookies.data,
                temp : req.cookies.temp,
                emailfav : result
            })
        }).catch(function(err){
            // //console.log(err)
        })
        
    }
    
}


// untuk menampilkan semua data di data base
exports.showalldata = function(req,res){
    connect.connection.query("SELECT * from transaksi",function(error,row,fields){
        if(error){
            connect.connection.log(error)
        }else{
            if(row.length>0)
            {
                response.ok(row,res);
            }else{
                response.error("Data tidak ditemukan",res);
            }     
        };
    });
};


//untuk menampilkan data berdasarkan iduser
exports.showbyiduser= function(req,res){
    var iduser = req.params.iduser;
    connect.connection.query("Select * from items where iduser=?",[iduser], function(error,row,fields){
        if(error){
            response.error(error,res);  
        }else{
            if(row.length > 0){
                response.ok(row,res)
            }else{
                response.error("Data Tidak Ditemukan",res)
            }
        }
    })
}

//untuk menampilkan satu data berdasarkan iduser
exports.showdatabyiduser= function(req,res){
    var iduser = req.params.iduser;
    var namaitem = req.params.namaitem;
    connect.connection.query("Select * from items where iduser=? and namaitem=?",[iduser,namaitem], function(error,row,fields){
        if(error){
            response.error(error,res);  
        }else{
            if(row.length > 0){
                response.ok(row,res)
            }else{
                response.error("Data Tidak Ditemukan",res)
            }
        }
    })
}


// untuk menampilkan data berdasarkan judul
exports.showbyjudul = function(req,res){
    var judul = req.params.judul;
    // //console.log(judul)
    connect.connection.query("SELECT * FROM items WHERE namaitem= ?",[judul],function(error,row,fields){
        if(error){
            connect.connection.log(error);
        }else{
            if(row.length>0)
            {
                response.ok(row,res);
            }else{
                response.error  ("Data tidak ditemukan",res);
            }
        }
    });
};


//menangani halaman not faund
exports.notfound = function(req,res){
    response.notfound("Halaman tidak ditemukan",res);
}



// menghapus data berdasarkan id dri tabel view
exports.delete = function(req,res){    
    if(req.cookies.user == undefined){
        return res.redirect('/login')
    }else{

        var id = parseInt(req.params.id);
        var data = req.cookies.temp;
        var temp_baru = []
        for(var i = 0 ; i<data.length ; i++){
            if(data[i].Id == id){
                continue;
            }else{
                temp_baru.push({
                    Id : temp_baru.length + 1,
                    Jenis_Transaksi : data[i].Jenis_Transaksi,
                    Jumlah_Transaksi : data[i].Jumlah_Transaksi
                })                
            }
        }
        res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
        req.session.massage = 'Berhasil Hapus Data'
        return res.redirect('/');        
    }
    
}

// untuk menghapus semua data
exports.deleteall = function(req,res){
    var data = req.cookies.temp;
    if(data.length == 0){
        req.session.massage = 'Data Sudah Kosong'
        return res.redirect('/');
    }else{
        res.cookie('temp',[] , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
        req.session.massage = 'Berhasil Hapus Semua Data'
        return res.redirect('/');
    }
}

// mengedit data berdasarkan id dari tabel view
exports.edit = function (req,res){
    
    var new_data = req.body;
    var jumlah = parseInt(new_data.jumlah);
    var jenis = new_data.jenis;
    var id = parseInt(new_data.id);
    var data = req.cookies.temp;
    var temp_baru = []
    var maxTransaksi = 1000000;
    var checkTransaksi = 0;

    // check apakah data berubah atau tidak
    for(var i = 0 ; i<data.length ; i++){
        if(data[i].Id == id){
            if(data[i].Jenis_Transaksi == jenis && data[i].Jumlah_Transaksi == jumlah){
                req.session.massage = 'Data Tidak Berubah'
                return res.redirect('/');
            }else{
                // check max transaksi
                checkTransaksi += parseInt(jumlah);
                if(checkTransaksi >= maxTransaksi){
                    req.session.massage = 'Transaksi Melebihi 1.000.000'
                    return res.redirect('/');
                }else{                        
                    temp_baru.push({
                        Id : temp_baru.length + 1,
                        Jenis_Transaksi : jenis,
                        Jumlah_Transaksi : jumlah
                    })
                }                
            }
        }else{
            checkTransaksi += parseInt(data[i].Jumlah_Transaksi);
            if(checkTransaksi >= maxTransaksi){
                req.session.massage = 'Transaksi Melebihi 1.000.000'
                return res.redirect('/');
            }else{
                temp_baru.push({
                    Id : temp_baru.length + 1,
                    Jenis_Transaksi : data[i].Jenis_Transaksi,
                    Jumlah_Transaksi : data[i].Jumlah_Transaksi
                })    
            }            
        }
    }
    res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
    req.session.massage = 'Berhasil Edit Data'
    return res.redirect('/');    
}

// create data 
exports.create = function(req,res){
    var jumlah = parseInt(req.body.jumlah);
    var jenis = req.body.jenis;
    var temp = req.cookies.temp;
    if(jumlah == 0 || jumlah == null || jumlah == undefined){
        req.session.massage = 'Jumlah Tidak Boleh Kosong'
        return res.redirect('/');
    }else{
        // check temp cookie apakah kosong atau tidak
        if(temp.length == 0){
            // mengubah cookie temp menjadi check_data
            res.cookie('temp',[{
                Id : 1,
                Jenis_Transaksi : jenis,
                Jumlah_Transaksi : jumlah
            }] , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
            req.session.massage = 'Berhasil Tambah Data'
            return res.redirect('/');
        }else{
            // check max transaksi
            var maxTransaksi = 1000000;
            var checkTransaksi = 0;
            for(var i = 0 ; i<temp.length ; i++){
                checkTransaksi += parseInt(temp[i].Jumlah_Transaksi);
                if(checkTransaksi >= maxTransaksi){
                    req.session.massage = 'Transaksi Melebihi 1.000.000'
                    return res.redirect('/');
                }
            }
            // mengecek batas jika ditambah jumlah baru
            checkTransaksi += jumlah;
            if(checkTransaksi >= maxTransaksi){
                req.session.massage = 'Transaksi Melebihi 1.000.000'
                return res.redirect('/');
            }else{
                // menambahkan data baru ke cookie temp
                var temp_baru = []
                for(var i = 0 ; i<temp.length ; i++){
                    temp_baru.push({
                        Id : temp_baru.length + 1,
                        Jenis_Transaksi : temp[i].Jenis_Transaksi,
                        Jumlah_Transaksi : temp[i].Jumlah_Transaksi
                    })
                }
                temp_baru.push({
                    Id : temp_baru.length + 1,
                    Jenis_Transaksi : jenis,
                    Jumlah_Transaksi : jumlah
                })
                res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                req.session.massage = 'Berhasil Tambah Data'
                return res.redirect('/');                
            }
        }
    }

    
}

// upload file csv
exports.uploadfile = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login')
    }else{
        var file = req.files.files;
        var filename = file.name;
        // get file extension
        var ext = filename.split('.').pop();
        // check file extension
        if(ext == 'csv' || ext == 'xlsx'){
            var path = './public/files/'+filename;            
            // Pindah file ke folder public
            file.mv(path,function(err){
                if(err){
                    req.session.massage = 'Gagal Upload File'
                    return res.redirect('/');
                }else{
                    var wookbook = server.xlsx.readFile(path);
                    var sheet_name_list = wookbook.SheetNames;
                    var data = server.xlsx.utils.sheet_to_json(wookbook.Sheets[sheet_name_list[0]]);
                    var check_data = []
                    var err = 0;
                    var maxTransaksi = 1000000;
                    var checkTransaksi = 0;
                    for(var i=0;i<data.length;i++){
                        if(Object.keys(data[i]).length != 3 ){
                            // Mengecek Format FIle 
                            if(Object.keys(data[i]).includes("Jenis_Transaksi") == true && Object.keys(data[i]).includes("Jumlah_Transaksi") == true){  
                                // mengecek Batas Transaksi  
                                if(checkTransaksi <= maxTransaksi){
                                    // Memasukkan data
                                    check_data.push({
                                        Id : i+1,
                                        Jenis_Transaksi : data[i].Jenis_Transaksi,
                                        Jumlah_Transaksi : data[i].Jumlah_Transaksi
                                    })
                                    checkTransaksi += parseInt(data[i].Jumlah_Transaksi);
                                }else{
                                    server.fs.unlinkSync(path);
                                    req.session.massage = 'Transaksi Melebihi 1.000.000'
                                    return res.redirect('/');
                                }
                            }else{
                                err =+ 1;
                            }
                        }else{
                            if(Object.keys(data[i]).includes("Jenis_Transaksi") == true && Object.keys(data[i]).includes("Jumlah_Transaksi") == true){                                
                                // mengecek Batas Transaksi  
                                if(checkTransaksi <= maxTransaksi){
                                    // Memasukkan data
                                    check_data.push({
                                        Id : i+1,
                                        Jenis_Transaksi : data[i].Jenis_Transaksi,
                                        Jumlah_Transaksi : data[i].Jumlah_Transaksi
                                    })
                                    checkTransaksi += parseInt(data[i].Jumlah_Transaksi);
                                }else{
                                    server.fs.unlinkSync(path);
                                    req.session.massage = 'Transaksi Melebihi 1.000.000'
                                    return res.redirect('/');
                                }
                            }else{
                                err =+ 1;                                
                            }
                        } 
                    }
                    if(err != 0 ){
                        server.fs.unlinkSync(path);
                        req.session.massage = 'Format File Salah'
                        return res.redirect('/');
                    }else{
                        // check temp cookie apakah kosong atau tidak
                        if(req.cookies.temp.length == 0){
                            // mengubah cookie temp menjadi check_data
                            res.cookie('temp',check_data , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                        }else{
                            var temp = req.cookies.temp;
                            // //console.log(temp)
                            for(var i = 0 ; i<check_data.length ; i++){
                                temp.push({
                                    Id : temp.length+ 1,
                                    Jenis_Transaksi : check_data[i].Jenis_Transaksi,
                                    Jumlah_Transaksi : check_data[i].Jumlah_Transaksi
                                })
                            }
                            res.cookie('temp',temp , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                        }                
                        server.fs.unlinkSync(path);
                        req.session.massage = 'Berhasil Upload File'
                        return res.redirect('/');
                    }
                    // hapus file di folder public
                }
            })
        }else{
            req.session.massage = 'Format File Salah'
            return res.redirect('/');                     
        }
    }
}


// check header csv
exports.checkheadercsv = function(req,res){
    var data = req.body;
    // //console.log(data)
    var err = 0;
    for(var i=0;i<data.length;i++){
        if(Object.keys(data[i]).length != 3 ){
            if(Object.keys(data[i]).includes("jenis_transaksi") == true && Object.keys(data[i]).includes("jumlah_transaksi") == true){
                continue;
            }else{
                err =+ 1;
            }
        }else{
            if(Object.keys(data[i]).includes("jenis_transaksi") == true && Object.keys(data[i]).includes("jumlah_transaksi") == true){
                continue;
            }else{
                err =+ 1;
            }
        } 
    }
    if(err == 0 ){
        // //console.log(err)
        for(var i=0;i<data.length;i++){
            data[i]['index'] = i;
        }
        // //console.log(data)
        response.ok(data,res);
    }else{
        // //console.log(err + " Format CSV Salah")
        response.error("Format Excel Salah",res);
    }
}

// download downloadformatcsv
exports.downloadformatcsv = function(req,res){
    var file = './public/files/formatcsv.xlsx';
    res.download(file);
}

// download temp data to csv
exports.downloaddatatemp = async function(req,res){
    var data = req.cookies.temp;
    // check data kosong atau tidak
    if(data.length == 0){
        req.session.massage = 'Data Kosong'
        return res.redirect('/');
    }else{
        var data_excel = []
        for(var i = 0 ; i<data.length ; i++){
            data_excel.push({
                No : data[i].Id,
                Jenis_Transaksi : data[i].Jenis_Transaksi,
                Jumlah_Transaksi : data[i].Jumlah_Transaksi
            })
        }
        // mengambil waktu dengan moment untuk nama file
        var waktu = Moment().format('DD-MM-YYYY HH-mm-ss');
        var filename = 'Data Transaksi '+waktu+'.xlsx';
        var path = './public/files/'+filename;
        // membuat file excel dengan data_excel

        var wookbook = server.xlsx.utils.book_new();
        var wooksheet = server.xlsx.utils.json_to_sheet(data_excel);
        server.xlsx.utils.book_append_sheet(wookbook,wooksheet,'Data Transaksi');
        server.xlsx.writeFile(wookbook,path)
        // download file
        res.download(path, function(err){
            try{
                if(err) {         
                    req.session.massage = 'Berhasil Download File'
                }

                server.fs.unlinkSync(path)
                req.session.massage = 'Berhasil Download File'
                return res.redirect('/');                
            }catch (err) {
                // //console.log(err)  
                req.session.massage = 'Berhasil Download File'
            }
        })
        req.session.massage = 'Berhasil Download File'
    }
}



exports.sendingemail = function(req,res){
    // var iduser = req.body.iduser;
    var email = req.body.email;
    var data = req.body.data;

    var data_check = []
    for (var i =0 ; i<data.length ;i++){
        if(data[i].select ==true){
            data_check.push(data[i].IDTDETAIL)
        }
    }
    // //console.log(data_check)
    if(data_check.length ==0){
        response.error("Tidak Ada Data Yang Dipilih" ,res)
    }else{
        //check email valid or not
        if(server.validate.validate(email) == false){
            response.error("Email tidak valid",res);
        }else{
            var sendemailproses = Items.sendemail(email,data_check);
            sendemailproses.then(function(result){
                // //console.log(result)
                response.ok(result,res);
            }).catch(function(err){
                response.error(err,res);
            })
        }
        
    }

}

// menambahkan excel to database
exports.exportexcel = function(req,res){
    if(req.body.cek == undefined){
        req.session.massage = 'Tidak Ada Data Yang Dipilih'
        return res.redirect('/');
    }else{
        var email = req.body.emailverify;
        var iduser = req.cookies.data.IDUSER;
        var temp = req.cookies.temp;
        if(req.body.saveemail != undefined){
            // validasi email
            if(server.validate.validate(email) == false){
                req.session.massage = 'Email Tidak Valid'
                return res.redirect('/');
            }else{
                // check email di database
                var checkemail = Items.checkemail(email , iduser);
                checkemail.then(function(result){
                    if(result.length == 0 ){
                        // insert email
                        var data_saveEmail = [
                            {
                                "EMAIL" : email,
                                "IDUSER" : iduser
                            }
                        ]
                        var insertemail = Items.insertemail(data_saveEmail);
                    }
                }).catch(function(err){
                    // //console.log(err)
                })

                // check apakah cek itu array atau bukan
                if(Array.isArray(req.body.cek) == true){
                    var cek = req.body.cek;
                    var data = []
                    // mengambil data berdasarkan Id yang dicek pada temp
                    for(var i = 0 ; i<temp.length ; i++){
                        for(var j = 0 ; j<cek.length ; j++){
                            if(cek[j] == temp[i].Id){
                                data.push(temp[i])
                            }
                        }
                    }
                    const Insert_data = Items.insert_transaksi_detail(data,email,iduser);
                    Insert_data.then(function(result){
                        // menghapus data cek pada temp
                        var temp_baru = []
                        for(var i = 0 ; i<temp.length ; i++){
                            if(cek.includes(String(temp[i].Id)) == false){                            
                                temp_baru.push({
                                    Id : temp_baru.length+1,
                                    Jenis_Transaksi : temp[i].Jenis_Transaksi,
                                    Jumlah_Transaksi : temp[i].Jumlah_Transaksi
                                })
                            }                            
                        }
                        //  mengupdate temp
                        res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                        req.session.massage = 'Proses Berhasil, Menunggu Verifikasi'
                        return res.redirect('/');
                    }).catch(function(err){
                    })
                    
                }else{
                    var cek = req.body.cek;
                    var data = []
                    // mengambil data berdasarkan Id yang dicek pada temp
                    for(var i = 0 ; i<temp.length ; i++){
                        if(cek == temp[i].Id){
                            data.push(temp[i])
                        }
                    }
                    const Insert_data = Items.insert_transaksi_detail(data,email,iduser);
                    Insert_data.then(function(result){
                        // menghapus data cek pada temp
                        var temp_baru = []
                        for(var i = 0 ; i<temp.length ; i++){
                            if(cek != temp[i].Id){
                                temp_baru.push({
                                    Id : temp_baru.length+1,
                                    Jenis_Transaksi : temp[i].Jenis_Transaksi,
                                    Jumlah_Transaksi : temp[i].Jumlah_Transaksi
                                })
                            }
                        }
                        //  mengupdate temp
                        res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                        req.session.massage = 'Proses Berhasil, Menunggu Verifikasi'
                        return res.redirect('/');
                    }).catch(function(err){
                    })
                }

            }
        }else{
            // validasi email
            if(server.validate.validate(email) == false){
                req.session.massage = 'Email Tidak Valid'
                return res.redirect('/');
            }else{
                
                // check apakah cek itu array atau bukan
                if(Array.isArray(req.body.cek) == true){
                    var cek = req.body.cek;
                    var data = []
                    // mengambil data berdasarkan Id yang dicek pada temp
                    for(var i = 0 ; i<temp.length ; i++){
                        for(var j = 0 ; j<cek.length ; j++){
                            if(cek[j] == temp[i].Id){
                                data.push(temp[i])
                            }
                        }
                    }
                    const Insert_data = Items.insert_transaksi_detail(data,email,iduser);
                    Insert_data.then(function(result){
                        // menghapus data cek pada temp
                        var temp_baru = []

                        for(var i = 0 ; i<temp.length ; i++){
                            if(cek.includes(String(temp[i].Id)) == false){                            
                                temp_baru.push({
                                    Id : temp_baru.length+1,
                                    Jenis_Transaksi : temp[i].Jenis_Transaksi,
                                    Jumlah_Transaksi : temp[i].Jumlah_Transaksi
                                })
                            }                            
                        }
                        // //console.log(temp_baru)
                        //  mengupdate temp
                        res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                        req.session.massage = 'Proses Berhasil, Menunggu Verifikasi'
                        return res.redirect('/');
                    }).catch(function(err){
                    })
                    
                }else{
                    var cek = req.body.cek;
                    var data = []
                    // mengambil data berdasarkan Id yang dicek pada temp
                    for(var i = 0 ; i<temp.length ; i++){
                        if(cek == temp[i].Id){
                            data.push(temp[i])
                        }
                    }
                    const Insert_data = Items.insert_transaksi_detail(data,email,iduser);
                    Insert_data.then(function(result){
                        // menghapus data cek pada temp
                        var temp_baru = []
                        for(var i = 0 ; i<temp.length ; i++){
                            if(cek != temp[i].Id){
                                temp_baru.push({
                                    Id : temp_baru.length+1,
                                    Jenis_Transaksi : temp[i].Jenis_Transaksi,
                                    Jumlah_Transaksi : temp[i].Jumlah_Transaksi
                                })
                            }
                        }
                        //  mengupdate temp
                        res.cookie('temp',temp_baru , { expires: new Date(new Date().getTime()+1000*60*60*24*365), httpOnly: true });
                        req.session.massage = 'Proses Berhasil, Menunggu Verifikasi'
                        return res.redirect('/');
                    }).catch(function(err){
                    })
                }

            }
        }
    }    
}


// menampilkan data yang mempunyai verifikasi 0
exports.showunverified = function(req,res){
    if(req.cookies.user == undefined){
        return res.redirect('/login')
    }
    else{
        if(req.cookies.data.ROLE == 'Admin'){
            var showunverified = Items.showdataUnverified();
            showunverified.then(function(result){
                return res.render('home/unverified' ,{
                    title : "Home | Verify",
                    layout : 'home/tamplate/main',
                    msg :req.session.massage,
                    data : req.cookies.data,
                    temp : req.cookies.temp,
                    unverified : result
                })
            }).catch(function(err){
                // //console.log(err)
            })
        }else{
            return res.redirect('/')
        }
    }
}

// proses verifikasi data
exports.verifyproses = function(req,res){
    // check apakah Admin atau bukan
    if(req.cookies.data.ROLE == 'Admin'){
        // check apakah cek undefined atau tidak
        if(req.body.cek == undefined){
            req.session.massage = 'Tidak Ada Data Yang Dipilih'
            return res.redirect('/verifydata')
        }else{
            var showunverified = Items.showdataUnverified();
            showunverified.then(function(result){
                // check apakah cek itu array atau bukan
                var otp = req.body.kodeotp;
                var err = 0 
                var data = []
                if(Array.isArray(req.body.cek) == true){ 
                    var cek = req.body.cek;
                    // mengambil data berdasarkan Id yang dicek pada temp
                    for(var i = 0 ; i<result.length ; i++){
                        for(var j = 0 ; j<cek.length ; j++){
                            if(cek[j] == result[i].IDTDETAIL){
                                if(otp == result[i].KODE_REFERRAL){
                                    data.push(result[i].IDTDETAIL)
                                }else{
                                    err += 1
                                }
                            }
                        }
                    }   
                }else{
                    var cek = req.body.cek;
                    // mengambil data berdasarkan Id yang dicek pada temp
                    for(var i = 0 ; i<result.length ; i++){
                        if(cek == result[i].IDTDETAIL){
                            if(otp == result[i].KODE_REFERRAL){
                                data.push(result[i].IDTDETAIL)
                            }else{
                                err += 1
                            }
                        }
                    }
                }

                if(err == 0){
                    // proses verifikasi dan mengapdate data verifikasi 0 menjadi 1
                    const verify = Items.updateverifikasi(data);
                    verify.then(function(result){
                        req.session.massage = 'Verifikasi Berhasil'
                        return res.redirect('/verifydata')
                    }).catch(function(err){
                        //console.log(err)
                    })

                }else{
                    req.session.massage = 'Kode OTP Tidak Sesuai ,Silahkan Cek Email Anda'
                    return res.redirect('/verifydata')
                }

            }).catch(function(err){
                //console.log(err)
            });
        }
    }else{  
        return res.redirect('/')
    }
}

// delte data yang belum diverifikasi
exports.deleteunverify = function(req,res){
    if(req.cookies.data.ROLE == 'Admin'){
        // id Transaksi Detail
        var id = req.params.id;
        // check mengambil IDTRANSAKSI berdasarkan IDTDETAIL
        var getidtransaksi = Items.getidtransaksi(id);
        getidtransaksi.then(function(result){
            var idtransaksi = result[0].IDTRANSAKSI;
            // check apakah pada transaksi detail masih ada data yang sama
            var check = Items.checkidtransaksi(idtransaksi);
            check.then(function(result){
                if(result.length >1 ){
                    var deltdetail = Items.deletedetail(id);
                    deltdetail.then(function(result){
                        req.session.massage = 'Data Berhasil Dihapus'
                        return res.redirect('/verifydata')
                    }).catch(function(err){
                        req.session.massage = 'Data Gagal Dihapus'
                        return res.redirect('/verifydata')
                    })
                }else{
                    // menghapus data pada transaksi_detail dan transaksi
                    var deltdetail = Items.deletedetail(id);
                    deltdetail.then(function(result){
                        // menghapus data pada transaksi
                        var deltransaksi = Items.deletetransaksi(idtransaksi);
                        deltransaksi.then(function(result){
                            req.session.massage = 'Data Berhasil Dihapus'
                            return res.redirect('/verifydata')
                        }).catch(function(err){
                            req.session.massage = 'Data Gagal Dihapus'
                            return res.redirect('/verifydata')
                        })
                    }).catch(function(err){
                        req.session.massage = 'Data Gagal Dihapus'
                        return res.redirect('/verifydata')
                    })
                }
            }).catch(function(err){
                req.session.massage = 'Data Gagal Dihapus'
                return res.redirect('/verifydata')
            })
        }).catch(function(err){
            req.session.massage = 'Data Gagal Dihapus'
            return res.redirect('/verifydata')
        })
    }else{
        return res.redirect('/')
    }
}

// check kode verifikasi
exports.checkkodeverifikasi = function(req,res){
    var data = req.body.data;
    var kode_referral = req.body.kode_referral;
    // //console.log(kode_referral)
    // //console.log(req.body)
    var data_check = []
    for (var i =0 ; i<data.length ;i++){
        if(data[i].select ==true){
            data_check.push(data[i].IDTDETAIL)
        }
    }
    // //console.log(data_check)
    var ambilkodeverifikasi = Items.ambilkodeverifikasi(data_check);
    ambilkodeverifikasi.then(function(result){
        var check = 0
        for(var i = 0 ; i< result.length ; i++){
            if(result[i].KODE_REFERRAL == kode_referral){
                continue;
            }else{
                check +=1;
            }
        }
        // //console.log(check)
        if(check == 0){
            // update verifikasi
            // //console.log(data)
            var updateverifikasi = Items.updateverifikasi(data_check);
            updateverifikasi.then(function(result){
                var ambildataterbaru = Items.showdataUnverified();
                ambildataterbaru.then(function(result){
                    // //console.log(result)
                    response.ok(result,res);
                }).catch(function(err){
                    response.error(err,res);
                })
            }).catch(function(err){
                response.error(err,res)
            })
        }else{
            response.error("KODE REFFERAL SALAH",res);
        }
    }).catch(function(err){
        response.error(err,res);
    })
}

// menampilkan data yang sudah diverifikasi
exports.transaksi = function(req,res){
    if(req.cookies.data.ROLE == 'Admin'){
        var showdata = Items.showdataVerified();
        showdata.then(function(result){
            var data = []
            for(var i = 0 ; i<result.length ; i++){
                var tanggal = result[i].SESSIONID;
                // get tanggal by session id
                var date = new Date(tanggal * 1000);
                var formattedTime = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                data.push({
                    IDTDETAIL : result[i].IDTDETAIL,
                    JENIS_TRANSAKSI : result[i].JENIS_TRANSAKSI,
                    JUMLAH_TRANSAKSI : result[i].JUMLAH_TRANSAKSI,
                    TGL_TRANSAKSI : formattedTime,
                })
            }
            // render view
            res.render('home/transaksi',{
                title : "Home | Transaction Data",
                layout : 'home/tamplate/main',
                data :req.cookies.data,
                temp : data,
                msg : req.session.massage
            })
        }).catch(function(err){})
    }else{
        return res.redirect('/')
    }
}

// download data transaksi_detail yang sudah diverifikasi
exports.downloadtransaksi = function(req,res){
    if(req.cookies.data.ROLE == 'Admin'){
        var showdata = Items.showdataVerified();
        showdata.then(function(result){
            var data = []
            for(var i = 0 ; i<result.length ; i++){
                var tanggal = result[i].SESSIONID;
                // get tanggal by session id
                var date = new Date(tanggal * 1000);
                var formattedTime = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                data.push({
                    IDTDETAIL : result[i].IDTDETAIL,
                    JENIS_TRANSAKSI : result[i].JENIS_TRANSAKSI,
                    JUMLAH_TRANSAKSI : result[i].JUMLAH_TRANSAKSI,
                    TGL_TRANSAKSI : formattedTime,
                })
            }
            // dari data yang sudah diambil diatas, dijadikan file excel dan di download

            var filename = 'Data Transaksi '+Date.now()+'.xlsx';
            var path = './public/files/'+filename;
            var workbook = server.xlsx.utils.book_new();
            var worksheet = server.xlsx.utils.json_to_sheet(data);
            server.xlsx.utils.book_append_sheet(workbook, worksheet, 'Data Transaksi');
            server.xlsx.writeFile(workbook, path);

            res.download(path, function(err){
                try{
                    if(err) {         
                        req.session.massage = 'Berhasil Download File'
                    }
    
                    server.fs.unlinkSync(path)
                    req.session.massage = 'Berhasil Download File'
                    return res.redirect('/transaction');                
                }catch (err) {
                    // //console.log(err)  
                    req.session.massage = 'Berhasil Download File'
                }
            })
        }).catch(function(err){})
    }else{
        return res.redirect('/')
    }
}