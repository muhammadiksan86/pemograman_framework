const router = require('express').Router();
const produk = require('./produk');
const customers = require('./customers');
const transaksi = require('./transaksi');
const dashboard = require('./dashboard');

router.use('/produk', produk);
router.use('/customers', customers);
router.use('/transaksi', transaksi);
router.use('/dashboard', dashboard);

module.exports = router