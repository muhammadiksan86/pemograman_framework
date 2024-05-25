const router = require('express').Router();
const produk = require('../controlers/produk');

router.get('/', produk.showAll);
router.get('/:id', produk.showById);
router.post('/', produk.create);
router.put('/:id', produk.update);
router.delete('/:id', produk.delete);
router.get('/produk-favorit', produk.produkFavorit);
router.get('/produk-kurang', produk.produk_kurang_dari_5)

module.exports = router;