const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    creat : async (req, res, next) => {
        try {
            const { id_customers, detil_transaksi } = req.body;
            
            var total_pembelian = 0;
            for (const detil of detil_transaksi) {
                const produk = await prisma.produk.findUnique({
                    where: {
                        id_produk : detil.id_produk
                    }
                }); 
                if (produk) {
                    total_pembelian += produk.harga * (detil.jumlah || 1);
                    await prisma.produk.update({
                        where: {
                            id_produk: produk.id_produk
                        },
                        data:{
                            stok: produk.stok - detil.jumlah
                        }
                    });
                }
            }

            const response = await prisma.transaksi.create({
                data: {
                    id_customers,
                    total_pembelian,
                    detil_transaksi: {
                        create: detil_transaksi
                    }
                }
            });
            res.json({
                status: true,
                message: 'Transaksi Berhasil Di lakukan',
                data: response
            })
        } catch (error) {
            next(error);
        }
    },
    showAll : async (req, res, next) => {
        try {
            const response = await prisma.transaksi.findMany({
                include: {
                    customers : true,
                    detil_transaksi: {
                        include: {
                            produk : true
                        }
                    }
                }
            });
            if (response.length == 0) {
                res.status(400).json({
                    status: false,
                    message: 'Transaksi Masih Kosong',
                    data: response
                });
                return;
            }
            res.json({
                status: true,
                message: 'transaksi Berhasil Di Tampilkan',
                data: response
            })
        } catch (error) {
            next(error);
        }
    },
    showById : async (req, res, next) => {
        try {
            const response = await prisma.transaksi.findUnique({
                where: {
                    id_transaksi : parseInt(req.params.id)
                },
                include: {
                    customers : true,
                    detil_transaksi: {
                        include: {
                            produk : true
                        }
                    }
                }
            });
            if (!response) {
                res.status(400).json({
                    status: false,
                    message: 'Transaksi Tidak Di Temukan',
                    data: response
                });
                return;
            }
            res.json({
                status: true,
                message: 'transaksi Berhasil Di Tampilkan',
                data: response
            })
        } catch (error) {
            next(error);
        }
    },
    update : async (req, res, next) => {
        try {
            const { id_customers, detil_transaksi } = req.body;
            
            const TransaksiLama = await prisma.transaksi.findUnique({
            where: { 
                id_transaksi: parseInt(req.params.id) 
            },
            include: { 
                detil_transaksi: true 
            }
            });
            for (const DetailLama of TransaksiLama.detil_transaksi) {
            const produk = await prisma.produk.findUnique({
                where: { 
                    id: DetailLama.id_produk 
                }
            });
            if (produk) {
                await prisma.produk.update({
                where: { 
                    id_produk: produk.id 
                },
                data: { 
                    stock: produk.stok + DetailLama.jumlah 
                }
                });
            }
            }
                       
            var total_pembelian = 0;
            for (const detail of detil_transaksi) {
                const produk = await prisma.produk.findUnique({
                    where: {
                        id : detail.id_produk
                    }
                }); 
                if (product) {
                    total_pembelian += produk.harga * (detail.jumlah || 1);
                    await prisma.produk.update({
                        where: {
                            id_produk: produk.id
                        },
                        data:{
                            stok: produk.stok - detail.jumlah
                        }
                    });
                }
            }

            const response = await prisma.transaksi.update({
                where: {
                    id_transaksi : parseInt(req.params.id)
                },
                data: {
                    id_customers,
                    total_pembelian,
                    detil_transaksi: {
                        create: detil_transaksi 
                    }
                }
            });
            res.json({
                status: true,
                message: 'Transaksi Berhasil Di lakukan',
                data: response
            })
        } catch (error) {
            next(error);
        }
    },
    delete : async (req, res, next) => {
        try {
            await prisma.detil_transaksi.delete({
                where: {
                    id_transaksi: parseInt(req.params.id)
                }
            });
            const response = await prisma.transaksi.delete({
                where: {
                    id : parseInt(req.params.id)
                }
            });
            res.json({
                status: true,
                message: 'Transaksi Berhasil Di Hapus',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
}