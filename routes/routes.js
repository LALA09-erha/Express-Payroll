'use strict';

module.exports = function(app){
    //untuk mengimport file Itemscontroller
    const Items = require('../controller/ItemsController');

    //untuk mengimport file UserController
    const User = require('../controller/UsersController');
    
    // untuk mengecek apakah rest api berjalan
    app.route('/').get(Items.index);

    // untuk menampilkan semua data di database
    app.route('/showall').get(Items.showalldata);

    // untuk menampilkan data unverified
    app.route('/verifydata').get(Items.showunverified)

    // untuk proses verifikasi data
    app.route('/verifyproses').post(Items.verifyproses)

    // delete data unverified
    app.route('/deleteunverify/:id').get(Items.deleteunverify)

     // untuk mendapatkan email dari daftar favorit
    app.route('/getemail/:iduser').get(User.getemail);

    //untuk menampilkan data berdasarkan iduser
    app.route('/showbyiduser/:iduser').get(Items.showbyiduser);
    
    //untuk menampilkan satu data berdasarkan iduser
    app.route('/showdatabyiduser/:iduser/:namaitem').get(Items.showdatabyiduser);
    
    //untuk menampilkan data berdasarkan judul
    app.route('/showbyjudul/:judul').get(Items.showbyjudul);

    
    //untuk parsing data
    // app.route('/parsingdata').post(Items.parsingdata);

    // untuk menambahkan excel to database
    app.route('/export-excel').post(Items.exportexcel);
    
    //route for login
    app.route('/login').get(User.loginview);

    // proses Login 
    app.route('/proseslogin').post(User.login)
    
    // //route for register
    // app.route('/register').post(User.register)
    
    //route for logout
    app.route('/logout').post(User.logout)
    
    //route for users view
    app.route('/users').get(User.users)
    
    // route for add user view
    app.route('/adduser').get(User.adduser)

    // //route for proses add user
    app.route('/prosesadd').post(User.register)

    // route for proses edit user
    app.route('/prosesedit').post(User.prosesedit)
    
    // route for edit user view
    app.route('/edituser/:id').get(User.edituser)

    //delete user
    app.route('/deleteuser/:id').get(User.deleteuser)

    //untuk menghapus data berdasarkan id
    app.route('/delete/:id').get(Items.delete);

    // for deleteall data
    app.route('/deleteall').post(Items.deleteall);
    
    //untuk mengedit data berdasarkan id
    app.route('/edit').post(Items.edit);
    
    // untuk menambahkan data
    app.route('/create').post(Items.create)

    //upload file csv route
    app.route('/uploadfile').post(Items.uploadfile);

    //check header csv 
    app.route('/checkheadercsv').post(Items.checkheadercsv)

    // untuk mendownload format csv
    app.route('/downloadformatcsv').post(Items.downloadformatcsv)

    //download downloaddata temp
    app.route('/downloaddata').post(Items.downloaddatatemp)
    
    //untuk mengirim email 
    app.route('/sendingemail').post(Items.sendingemail)

    // untuk verifikasi kode refferal
    app.route('/verifikasikode').post(Items.checkkodeverifikasi)

    // untuk masukkan email ke daftar favorit
    app.route('/saveemail').post(User.saveemail);

    // untuk menampilkan transaksi data
    app.route('/transaction').get(Items.transaksi);

    // proses download data transaksi
    app.route('/downloaddatatransaksi').post(Items.downloadtransaksi);


    // untuk mengembalikan jika tidak ada route yang menagani 
    app.route('/:route/(*)').get(Items.notfound);

    //untuk mengembalikan jika tidak ada route yang manangani
    app.route('/:route').get(Items.notfound);
}
