var router = require('express').Router();


router.get('/api/empty-can/:id', function(req, res, next){
	res.json(req.params.id)
});

module.exports = router;
