const { resolve } = require('url');
const conn = require('../database/connect');
const nodemailer = require("nodemailer");
const referralCodes = require("referral-codes");



//insert data to database (transaksi)
const insert_transaksi = (data) => {
    // console.log(data); 
    return new Promise((resolve, reject) => {
        conn.connection.query('INSERT INTO transaksi SET ?', data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

}

const insert_detail_transaksi = (data) => {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < data.length; i++) {
            var data_insert = data[i];
            conn.connection.query('INSERT INTO transaksi_detail SET ?', data_insert, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }
    });
}

//sending email
const sendemail = (data,data_3) => {
    
    // pembuatan kode OTP
    var reverral_code = ""
    for (var i = 0 ; i < 6 ; i++){
        reverral_code += Math.floor(Math.random() * 10);
    }
    return new Promise((resolve,reject) => {

        //// Proses pengiriman email
        var transporter = nodemailer.createTransport({
            host: 'smtppro.zoho.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'erhacaca@zohomail.com',
              pass: 'ADLv2eEd3aDd'
            }
            });
            var mailOptions = {
                from: '"APP Payroll" <erhacaca@zohomail.com>',
                to:data,
                subject: 'OTP Code',
                text: 'Your OTP Code is '+reverral_code,                
                // make simple tamplate for email with box and color
                html: '<div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, Helvetica, sans-serif;">'+
                '<div style="background-color: white; padding: 20px; border-radius: 10px;">'+
                '<h1 style="text-align: center;">OTP Code</h1>'+
                '<p style="text-align: center;">Your OTP Code is <b>'+reverral_code+'</b> For Data Transaction '+ data_3 +'</p>'+
                '<p style="text-align: center;">Please input your OTP Code to finish your transaction</p>'+
                '<p style="text-align: center;">Thank you</p>'+
                '</div>'+
                '</div>'

            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    reject(error);
                } else {
                        var updateCodeReferral = updateKode(reverral_code,data_3);
                        updateCodeReferral.then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                        resolve(info.response);
                }
            });
    })
}

//insert data to database (transaksi_detail)
const insert_transaksi_detail = (data,data_2,data_3) => {    
    var email = data_2;
    var check_err = null;
    var data_new  =0;
    // memulai memasukkan data ke transaksi 
    return new Promise((resolve, reject) => {
    //     //  make id session 
        const session_id = Math.floor(Date.now() / 1000);
        const data_transaksi = data;
        const data_iduser = data_3;
        // menghitung jumlah total transaksi
        var jumlah_total = 0;
        for(var i = 0 ; i < data_transaksi.length ; i++){
            jumlah_total += Number(data_transaksi[i].Jumlah_Transaksi);
        }

    //     //make a object for insert to database transaksi
        const data_insert_transaksi = {
            IDUSER : data_iduser,
            TOTALTRANSAKSI : jumlah_total,
            SESSIONID : session_id
        }
        var IDTRANSAKSI = insert_transaksi(data_insert_transaksi);
        IDTRANSAKSI.then(function(result){
            const IDTRANSAKSI = result.insertId;
            var data_insert_transaksi_detail = [];
            for(var i = 0 ; i < data_transaksi.length ; i++){
                // make a object for insert to database transaksi_detail
                 data_insert_transaksi_detail.push ({
                    IDUSER : data_iduser,
                    IDTRANSAKSI : IDTRANSAKSI,
                    JENIS_TRANSAKSI : data_transaksi[i].Jenis_Transaksi,
                    JUMLAH_TRANSAKSI : data_transaksi[i].Jumlah_Transaksi,
                    SESSIONID : session_id,
                    VERIFIKASI : 0,
                    KODE_REFERRAL: 0
                })
                
            }
            var TRANSAKSI_DETAIL = insert_detail_transaksi(data_insert_transaksi_detail);  
            
            TRANSAKSI_DETAIL.then(function(result2){   
                data_new = result2.insertId;
                var data_index = []
                for (var p=0; data.length > p; p++){
                    data_index.push(data_new);
                    data_new++;
                }


                // to send email
                var sendingemail =  sendemail(email,data_index);
                sendingemail.then(function(result3){
                    resolve(result3);
                }).catch(function(err){
                    reject(err);
                });

            }).catch(function(err){
                check_err = err;
            });
            check += 1;
        }).catch(function(err){
            check_err = err;
        });

        if(check_err != null){
            reject(check_err);
        }
    });

}

// for get nama item by id user
const getnamaitem = (data) => {
    return new Promise((resolve, reject) => {
        conn.connection.query('select namaitem from items where iduser=?',[data], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });}


//update jumlah item
const updatejumlahitem = (data,data_2) => {    
    return new Promise((resolves, reject) => {
        conn.connection.query('select * from items where namaitem=? and iduser=?',[data,data_2], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolves(result);
            }
        });
    });
}

//mengambil jumlah item yanng dipilih
const updatejumlahitemfix = (data,data_2,data_3,data_4) => {
    return new Promise((resolve, reject) => {
        conn.connection.query('UPDATE items SET jumlahitem=?, idsession=? WHERE namaitem=? and iduser=?',[data.toString(),data_4,data_2,data_3], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);

            }
        });
    });
}

//delete data from tabel items
const deleteview = (data,data_2) => {
    return new Promise((resolve,reject) => {
        // looping data
        const old_data = data
        const new_data = data.splice(data_2,1);
        resolve(old_data);
    });
}

// edit data from tabel items
const editview = (data,data_2,data_3) => {
    // console.log(data_3);
    // console.log(data_2);
    // console.log(data);
    var old_data = data;
    return new Promise((resolve,reject) =>{
        var check_err = 0 ;
        var check_limit = 0;
        // looping data
        var new_data = data_3.jenis_transaksi;
        var first_letter = new_data.charAt(0).toUpperCase();
        var other_letter = new_data.slice(1);
        data_3.jenis_transaksi = first_letter + other_letter;

        for (let i = 0; i < data.length; i++) {
            //cehck if format number already . or not
            if(data[i].jumlah_transaksi.toString().indexOf('.')){
                data[i].jumlah_transaksi = data[i].jumlah_transaksi.toString().replace('.','');
            }else{
                data[i].jumlah_transaksi = data[i].jumlah_transaksi;
            }

            //check_err apakah index i sama dengan data_2
            if (i == data_2) {
                //check_err apakah ada perubaha data atau tidak
                if(data[i].jenis_transaksi != data_3.jenis_transaksi || data[i].jumlah_transaksi != data_3.jumlah_transaksi){
                    // check if jumlah_transaaksi already . or not
                    if(data_3.jumlah_transaksi.toString().indexOf('.')){
                        data_3.jumlah_transaksi = data_3.jumlah_transaksi.toString().replace('.','');
                    }else{
                        data_3.jumlah_transaksi = data_3.jumlah_transaksi;
                    }
                    data[i].jenis_transaksi = data_3.jenis_transaksi;
                    data[i].jumlah_transaksi = Number(data_3.jumlah_transaksi);
                    check_err = 1;
                }else{
                    check_err = 0;
                }

            }
            check_limit += Number(data[i].jumlah_transaksi);
        }
        // console.log(check_limit);
        
        // check_err apakah ada perubahan atau tidak
        if(check_err == 1){
            if(check_limit <= 110){
                console.log('masuk');
                resolve(data);
            }else{
                reject(old_data);
            }
        }else{
            reject(old_data)
        }
    })
}

const createItem = (data,data_2)=>{
    console.log(data);
    console.log(data_2);
    return new Promise((resolve,reject)=>{
        var item = data;
        var lengthItem = item.length;
        var jenis_transaksi = data_2.jenis_transaksi;
        var first_letter = jenis_transaksi.charAt(0).toUpperCase();
        var other_letter = jenis_transaksi.slice(1);
        data_2.jenis_transaksi = first_letter + other_letter;

         // if not exist then push data
        
        data_2['jenis_transaksi'] = data_2.jenis_transaksi;
        data_2['index'] = lengthItem;
        var check = 0;
        for(var i = 0 ; i < item.length ; i++){
            //cehck if format number already . or not
            if(item[i].jumlah_transaksi.toString().includes(".")){
                item[i].jumlah_transaksi = item[i].jumlah_transaksi.toString().replace(/\./g, "");
            }else{
                item[i].jumlah_transaksi = item[i].jumlah_transaksi;
            }
            item[i].jumlah_transaksi = parseInt(item[i].jumlah_transaksi);
            check += item[i].jumlah_transaksi;
        }
        if(check + Number(data_2.jumlah_transaksi) <= 110){
            item.push(data_2);
            resolve(item);
        }else{
            reject(item);
        }
    })
}

const updateKode = (data,data_2) => { 
    return new Promise((resolve,reject) => {
        conn.connection.query('UPDATE transaksi_detail SET KODE_REFERRAL=? WHERE IDTDETAIL in (?)',[data,data_2],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result);
                resolve(result);
            }
        })
    })
}

//get email by id user
const getemail = (data) => {
    return new Promise((resolve,reject) => {
        conn.connection.query('select EMAIL from users where IDUSER=?',[data],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })

}




// show data unverified 
const showdataUnverified = () => {
    return new Promise((resolve,reject) => {
        conn.connection.query('select * from transaksi_detail where VERIFIKASI=0',(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result)
                resolve(result);
            }
        })
    })
}

const ambilkodeverifikasi = (data) => {
    // console.log(data)
    return new Promise((resolve,reject) => {
        conn.connection.query('select IDTDETAIL,VERIFIKASI,KODE_REFERRAL from transaksi_detail WHERE IDTDETAIL in (?)',[data],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result)
                resolve(result);
            }
        })
    })
}

const updateverifikasi = (data) => {
    // console.log(data)
    return new Promise((resolve,reject) => {
        conn.connection.query('UPDATE transaksi_detail SET VERIFIKASI=1 WHERE IDTDETAIL in (?)',[data],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result);
                resolve(result);
            }
        });
    })
}

// mengambil IDTRANSAKSI dengan IDTDETAIL
const getidtransaksi = (data) => {
    return new Promise((resolve,reject) => {
        conn.connection.query('select * from transaksi_detail where IDTDETAIL=?',[data],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result);
                resolve(result);
            }
        })
    })
}

// get data by checkidtransaksi
const checkidtransaksi = (data) => {
    return new Promise((resolve,reject) => {
        conn.connection.query('select * from transaksi_detail where IDTRANSAKSI=?',[data],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result);
                resolve(result);
            }
        })
    })
}

// delete deletedetail by idTdetail
const deletedetail = (data) => {
    return new Promise((resolve,reject) => {
        conn.connection.query('DELETE FROM transaksi_detail WHERE IDTDETAIL=?',[data],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result);
                resolve(result);
            }
        })
    })
}

// delete deletetransaksi by idtransaksi
const deletetransaksi = (data) => {
    return new Promise((resolve,reject) => {
        conn.connection.query('DELETE FROM transaksi WHERE IDTRANSAKSI=?',[data],(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result);
                resolve(result);
            }
        })
    })
}



// select all email by iduser
const getemailbyiduser = (iduser) => {
    return new Promise((resolve, reject) => {
        conn.connection.query('SELECT * FROM email_fav WHERE iduser=?', [iduser], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


// mengecek email sudah ada atau belum
const checkemail = (email, iduser) => {
    return new Promise((resolve, reject) => {
        conn.connection.query('SELECT * FROM email_fav WHERE email=? AND iduser=?', [email, iduser], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// insert email
const insertemail = (data) =>{
    return new Promise((resolve, reject) => {
        conn.connection.query('INSERT INTO email_fav SET ?', data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// untuk mengambil data semua transaksi_detail yang sudah di verifikasi
const showdataVerified = () => {
    return new Promise((resolve,reject) => {
        conn.connection.query('select * from transaksi_detail where VERIFIKASI=1',(err,result) => {
            if(err){
                reject(err);
            }else{
                // console.log(result)
                resolve(result);
            }
        })
    })
}

//exports all function
module.exports = {showdataVerified,deletetransaksi, deletedetail ,checkidtransaksi,getidtransaksi, getnamaitem, updatejumlahitem,updatejumlahitemfix,insert_transaksi_detail , deleteview,editview,createItem,getemail,sendemail,showdataUnverified,getemailbyiduser,ambilkodeverifikasi,updateverifikasi,insertemail,checkemail};