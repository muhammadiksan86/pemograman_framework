const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    showAll: async (_, res, next) => {
        try {
          const response = await prisma.customers.findMany();
    
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
          const response = await prisma.customers.findUnique({
            where: {
              id_customers: parseInt(req.params.id)
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
    
          const exist = await prisma.customers.findFirst({
            where: {
              nama_customers: req.body.nama_customers
            }
          });
    
          if (exist) {
            return res.status(400).json({
              status: false,
              message: 'customers already exist',
              data: exist
            });
          }
    
          const response = await prisma.customers.create({
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
          const response = await prisma.customers.update({
            where: {
              id_customers: parseInt(req.params.id)
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
          const response = await prisma.customers.delete({
            where: {
              id_customers: parseInt(req.params.id)
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
      total: async (req, res, next) => {
        try {
            const response = await prisma.customers.findMany({
                include: {
                    orders: true
                }
            });
            const customersTransaksi = response.map(customers => {
                const total = customers.orders.reduce((sum, order) => sum + order.total, 0);
                return {
                    name: customers.nama_customers,
                    total_pembelian: total
                };
            });
    
            res.json({
                status: true,
                message: 'success',
                data: customersTransaksi
            });
        } catch (error) {
            next(error);
        }
    },
    topCustomers: async (req, res, next) => {
        try {
            const response = await prisma.customers.findMany({
                include: {
                    orders: {
                        include: {
                            details: true
                        }
                    }
                }
            });
            const customersTotals = response.map(customers => {
                const total = customers.orders.reduce((sum, order) => sum + order.total, 0);
                const totalItem = customers.orders.reduce((sum, order) =>
                    sum + order.details.reduce((detailSum, detail) => detailSum + detail.jumlah, 0), 0);
                return {
                    name: customers.nama_customers,
                    jumlah_item: totalItem,
                    total_pembelian: total
                };
            });
    
            const customersTop = customersTotals.sort((a, b) => b.total_pembelian - a.total_pembelian).slice(0, 3);
    
            res.json({
                status: true,
                message: 'success',
                data: customersTop
            });
        } catch (error) {
            next(error);
        }
    },
    ratarata_Umur: async (req, res, next) => {
        try {
            const response = await prisma.customers.findMany({
                where: {
                    orders: {
                        some: {}
                    }
                },
                select: {
                    umur: true
                }
            });
            const totalumur = response.reduce((sum, customers) => sum + customers.umur, 0);
            const rataUmur = response.length > 0 ? totalumur / response.length : 0;
            res.json({
                status: true,
                message: 'success',
                data: rataUmur
            });
        } catch (error) {
            next(error);
        }
    },
    topGender: async (req, res, next) => {
        try {
            const response = await prisma.customers.groupBy({
                by: ['jenis_kelamin'],
                _count: {
                    jenis_kelamin: true
                },
                orderBy: {
                    _count: {
                        jenis_kelamin: 'desc'
                    }
                },
                where: {
                    orders: {
                        some: {}
                    }
                }
            });
            const topJk = response[0];
    
            res.json({
                status: true,
                message: 'success',
                data: {
                    jenis_kelamin: topJk.jenis_kelamin,
                    frekunsi_pembelian: topJk._count.jenis_kelamin
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
};