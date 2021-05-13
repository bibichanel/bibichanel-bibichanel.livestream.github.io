class SearchController{
    //GET search
    index(req, res) {
        res.render('livestream');
    }
}

module.exports = new SearchController;