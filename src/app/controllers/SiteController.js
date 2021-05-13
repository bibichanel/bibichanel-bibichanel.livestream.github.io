class SiteController{
    //GET home
    index(req, res) {
        res.render('home');
    }

    show(req, res){
        res.send('Khanh Trung Dep trai vl!!!!');
    }
}

module.exports = new SiteController;