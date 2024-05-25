const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    showAll: async (_, res, next) => {
        try {
          const response = await prisma.produk.findMany();
    
          if (response.length == 0) {
            return res.status(404).json({
              status: false,
              message: 'data not found',
              data: response
            });
          }
    
          return res.json({
            status: true,
            message: 'success',
            data: response
          });
        } catch (error) {
          next(error);
        }
      },
      showById: async (req, res, next) => {
        try {
          const response = await prisma.produk.findUnique({
            where: {
              id_produk: parseInt(req.params.id)
            }
          });
    
          if (!response) {
            return res.status(404).json({
              status: false,
              message: 'data not found',
              data: response
            });
          }
    
          return res.json({
            status: true,
            message: 'success',
            data: response
          });
        } catch (error) {
          next(error);
        }
      },
      create: async (req, res, next) => {
        try {
    
          const exist = await prisma.produk.findFirst({
            where: {
              nama_produk: req.body.nama_produk
            }
          });
    
          if (exist) {
            return res.status(400).json({
              status: false,
              message: 'produk already exist',
              data: exist
            });
          }
    
          const response = await prisma.produk.create({
            data: {
              ...req.body
            }
          });
    
          return res.json({
            status: true,
            message: 'success',
            data: response
          });
        } catch (error) {
          next(error);
        }
      },
      update: async (req, res, next) => {
        try {
          const response = await prisma.produk.update({
            where: {
              id_produk: parseInt(req.params.id)
            },
            data: {
              ...req.body
            }
          });
    
          return res.json({
            status: true,
            message: 'success',
            data: response
          });
        } catch (error) {
          next(error);
        }
      },
      delete: async (req, res, next) => {
        try {
          const response = await prisma.produk.delete({
            where: {
              id_produk: parseInt(req.params.id)
            }
          });
    
          return res.json({
            status: true,
            message: 'success',
            data: response
          });
        } catch (error) {
          next(error);
        }
      },
      produkFavorit: async (req, res, next) => {
        try {
            const response = await prisma.produk.findMany({
                include: {
                    details: true
                }
            });
            const dataProduk = response.map(product => {
                const jumlahFrekuensi = product.details.length;
                const totalPembelian = product.details.reduce((sum, detail) => sum + (detail.jumlah * product.harga), 0);
    
                return {
                    name: produk.nama_produk,
                    jumlah_frekuensi: jumlahFrekuensi,
                    total_pembelian: totalPembelian
                };
            }).sort((a, b) => b.jumlah_frekuensi - a.jumlah_frekuensi)[0];
    
            res.json({
                status: true,
                message: 'success',
                data: dataProduk
            });
        } catch (error) {
            next(error);
        }
    },
    produk_kurang_dari_5: async (req, res, next) => {
        try {
            const response = await prisma.produk.findMany({
                where: {
                    stok: {
                        lt: 5
                    }
                },
                include: {
                    details: true
                }
            });
            const produkDipilih = response.filter(produk => produk.details.length > 0);
    
            res.json({
                status: true,
                message: 'success',
                data: produkDipilih
            });
        } catch (error) {
            next(error);
        }
    }
};