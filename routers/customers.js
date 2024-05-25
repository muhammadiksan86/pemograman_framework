const router = require('express').Router();
const customers = require('../controlers/customers');

router.get('/', customers.showAll);
router.get('/:id', customers.showById);
router.post('/', customers.create);
router.put('/:id', customers.update);
router.delete('/:id', customers.delete);
router.get('/total', customers.total);
router.get('/top-customer', customers.topCustomers);
router.get('/rata-rata-umur', customers.ratarata_Umur);
router.get('/top-gender', customers.topGender)

module.exports = router;