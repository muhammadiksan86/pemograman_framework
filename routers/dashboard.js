const router = require('express').Router();
const dashboard = require('../controlers/dashboard');

router.get('/', dashboard.dashboard);

module.exports = router