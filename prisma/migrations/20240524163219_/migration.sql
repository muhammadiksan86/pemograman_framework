-- CreateTable
CREATE TABLE `customers` (
    `id_customers` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_customers` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `jenis_kelamin` VARCHAR(12) NOT NULL,
    `umur` INTEGER NOT NULL,

    PRIMARY KEY (`id_customers`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id_produk` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_produk` VARCHAR(100) NOT NULL,
    `harga` INTEGER NOT NULL,
    `stok` INTEGER NOT NULL,

    PRIMARY KEY (`id_produk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `id_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_customers` INTEGER NOT NULL,
    `total_pembelian` INTEGER NOT NULL,

    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detil_transaksi` (
    `id_detil_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL,
    `id_produk` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,

    PRIMARY KEY (`id_detil_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_customers_fkey` FOREIGN KEY (`id_customers`) REFERENCES `customers`(`id_customers`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detil_transaksi` ADD CONSTRAINT `detil_transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detil_transaksi` ADD CONSTRAINT `detil_transaksi_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;
