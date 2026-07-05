-- CreateEnum
CREATE TYPE "jadwal_praktek_hari" AS ENUM ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu');

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "tahun" INTEGER,
    "gambar" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dokter" (
    "id_dokter" SERIAL NOT NULL,
    "nama_lengkap" VARCHAR(150) NOT NULL,
    "foto_url" VARCHAR(255),
    "deskripsi" TEXT,
    "id_spesialis" INTEGER,
    "id_subspesialis" INTEGER,
    "status_aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "dokter_pkey" PRIMARY KEY ("id_dokter")
);

-- CreateTable
CREATE TABLE "jadwal_praktek" (
    "id_jadwal" SERIAL NOT NULL,
    "id_dokter" INTEGER,
    "hari" "jadwal_praktek_hari",
    "jam_mulai" TIME(0),
    "jam_selesai" TIME(0),
    "nama_poli" VARCHAR(100),

    CONSTRAINT "jadwal_praktek_pkey" PRIMARY KEY ("id_jadwal")
);

-- CreateTable
CREATE TABLE "kategori_layanan" (
    "id_kategori" SERIAL NOT NULL,
    "nama_kategori" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),
    "icon_url" VARCHAR(255),
    "urutan" INTEGER DEFAULT 0,
    "status_aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "kategori_layanan_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "layanan" (
    "id_layanan" SERIAL NOT NULL,
    "id_kategori" INTEGER,
    "nama_layanan" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150),
    "icon_url" VARCHAR(255),
    "gambar_banner" VARCHAR(255),
    "deskripsi_singkat" VARCHAR(255),
    "deskripsi_lengkap" TEXT,
    "kontak_darurat" VARCHAR(50),
    "urutan" INTEGER DEFAULT 0,
    "status_aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "layanan_pkey" PRIMARY KEY ("id_layanan")
);

-- CreateTable
CREATE TABLE "spesialis" (
    "id_spesialis" SERIAL NOT NULL,
    "nama_spesialis" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),

    CONSTRAINT "spesialis_pkey" PRIMARY KEY ("id_spesialis")
);

-- CreateTable
CREATE TABLE "subspesialis" (
    "id_subspesialis" SERIAL NOT NULL,
    "nama_subspesialis" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),

    CONSTRAINT "subspesialis_pkey" PRIMARY KEY ("id_subspesialis")
);

-- CreateTable
CREATE TABLE "tipe_kamar" (
    "id_kamar" SERIAL NOT NULL,
    "nama_kamar" VARCHAR(100) NOT NULL,
    "gambar_url" VARCHAR(255),
    "fasilitas" TEXT,
    "harga_mulai" DECIMAL(12,2),
    "jumlah_tersedia" INTEGER DEFAULT 0,
    "status_aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "tipe_kamar_pkey" PRIMARY KEY ("id_kamar")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "isi" TEXT NOT NULL,
    "gambar" VARCHAR(255),
    "tanggal" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "gambar" VARCHAR(255),
    "tanggal_mulai" TIMESTAMP(0),
    "tanggal_berakhir" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "telepon" VARCHAR(50),
    "email" VARCHAR(255),
    "alamat" TEXT,
    "maps_link" TEXT,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "linktree_url" VARCHAR(500),

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dokter_id_spesialis_idx" ON "dokter"("id_spesialis");

-- CreateIndex
CREATE INDEX "dokter_id_subspesialis_idx" ON "dokter"("id_subspesialis");

-- CreateIndex
CREATE INDEX "jadwal_praktek_id_dokter_idx" ON "jadwal_praktek"("id_dokter");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_layanan_slug_key" ON "kategori_layanan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "layanan_slug_key" ON "layanan"("slug");

-- CreateIndex
CREATE INDEX "layanan_id_kategori_idx" ON "layanan"("id_kategori");

-- CreateIndex
CREATE UNIQUE INDEX "spesialis_slug_key" ON "spesialis"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subspesialis_slug_key" ON "subspesialis"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- AddForeignKey
ALTER TABLE "dokter" ADD CONSTRAINT "dokter_id_spesialis_fkey" FOREIGN KEY ("id_spesialis") REFERENCES "spesialis"("id_spesialis") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "dokter" ADD CONSTRAINT "dokter_id_subspesialis_fkey" FOREIGN KEY ("id_subspesialis") REFERENCES "subspesialis"("id_subspesialis") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "jadwal_praktek" ADD CONSTRAINT "jadwal_praktek_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "dokter"("id_dokter") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "layanan" ADD CONSTRAINT "layanan_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "kategori_layanan"("id_kategori") ON DELETE RESTRICT ON UPDATE RESTRICT;
