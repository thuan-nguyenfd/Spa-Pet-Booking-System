-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2026 at 11:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spathucung`
--

-- --------------------------------------------------------

--
-- Table structure for table `chitietcombo`
--

CREATE TABLE `chitietcombo` (
  `macombo` int(11) NOT NULL,
  `madichvucon` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitietdatlich`
--

CREATE TABLE `chitietdatlich` (
  `id` int(11) NOT NULL,
  `madatlich` int(11) NOT NULL,
  `madichvu` int(11) NOT NULL,
  `tendichvu` varchar(150) NOT NULL,
  `gia` decimal(12,2) NOT NULL,
  `thoiluongphut` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `danhgia`
--

CREATE TABLE `danhgia` (
  `madanhgia` int(11) NOT NULL,
  `madatlich` int(11) NOT NULL,
  `sosao` tinyint(4) NOT NULL,
  `binhluan` text DEFAULT NULL,
  `is_hidden` tinyint(4) NOT NULL DEFAULT 0,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `datlich`
--

CREATE TABLE `datlich` (
  `madatlich` int(11) NOT NULL,
  `codedatlich` varchar(30) NOT NULL,
  `manguoidung` int(11) NOT NULL,
  `tenlienhe` varchar(100) NOT NULL,
  `sdtlienhe` varchar(15) NOT NULL,
  `emaillienhe` varchar(100) NOT NULL,
  `mathucung` int(11) NOT NULL,
  `tenthucung` varchar(100) NOT NULL,
  `loaithucung` enum('DOG','CAT','OTHER') NOT NULL,
  `cannangthucung` decimal(5,2) NOT NULL,
  `ghichu` text DEFAULT NULL,
  `manhanvien` int(11) NOT NULL,
  `ngayhen` date NOT NULL,
  `giobatdau` time NOT NULL,
  `gioketthuc` time NOT NULL,
  `tongtien` decimal(12,2) NOT NULL DEFAULT 0.00,
  `trangthaidatlich` enum('PENDING','CONFIRMED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `trangthaithanhtoan` enum('UNPAID','PAID') NOT NULL DEFAULT 'UNPAID',
  `lydohuy` varchar(255) DEFAULT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `dichvu`
--

CREATE TABLE `dichvu` (
  `madichvu` int(11) NOT NULL,
  `ten` varchar(150) NOT NULL,
  `loaidichvu` enum('SINGLE','COMBO') NOT NULL DEFAULT 'SINGLE',
  `thoiluongphut` int(11) NOT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `mota` text DEFAULT NULL,
  `trangthai` tinyint(4) NOT NULL DEFAULT 1,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `giadichvu`
--

CREATE TABLE `giadichvu` (
  `magiadichvu` int(11) NOT NULL,
  `madichvu` int(11) NOT NULL,
  `cannangtu` decimal(5,2) NOT NULL,
  `cannangden` decimal(5,2) NOT NULL,
  `gia` decimal(12,2) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `manguoidung` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `matkhau` varchar(255) DEFAULT NULL,
  `hoten` varchar(100) NOT NULL,
  `sodienthoai` varchar(15) DEFAULT NULL,
  `googleid` varchar(255) DEFAULT NULL,
  `nhacungcap` enum('LOCAL','GOOGLE') NOT NULL DEFAULT 'LOCAL',
  `vaitro` enum('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `trangthai` tinyint(4) NOT NULL DEFAULT 1,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nhanvien`
--

CREATE TABLE `nhanvien` (
  `manhanvien` int(11) NOT NULL,
  `ten` varchar(100) NOT NULL,
  `gioitinh` enum('MALE','FEMALE','OTHER') NOT NULL DEFAULT 'OTHER',
  `sodienthoai` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `trangthai` tinyint(4) NOT NULL DEFAULT 1,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thanhtoan`
--

CREATE TABLE `thanhtoan` (
  `mathanhtoan` int(11) NOT NULL,
  `madatlich` int(11) NOT NULL,
  `phuongthuc` enum('VNPAY','CASH') NOT NULL,
  `sotien` decimal(12,2) NOT NULL,
  `vnp_txn_ref` varchar(100) DEFAULT NULL,
  `vnp_transaction_no` varchar(100) DEFAULT NULL,
  `trangthai` enum('PENDING','SUCCESS','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `vnp_response_code` varchar(10) DEFAULT NULL,
  `vnp_transaction_status` varchar(10) DEFAULT NULL,
  `vnp_bank_code` varchar(20) DEFAULT NULL,
  `vnp_bank_tran_no` varchar(255) DEFAULT NULL,
  `vnp_card_type` varchar(20) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `thoigianthanhtoan` datetime DEFAULT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `thucung`
--

CREATE TABLE `thucung` (
  `mathucung` int(11) NOT NULL,
  `manguoidung` int(11) NOT NULL,
  `tenthucung` varchar(100) NOT NULL,
  `loaithucung` enum('DOG','CAT','OTHER') NOT NULL,
  `giong` varchar(100) DEFAULT NULL,
  `cannang` decimal(5,2) NOT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `trangthai` tinyint(4) NOT NULL DEFAULT 1,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaycapnhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chitietcombo`
--
ALTER TABLE `chitietcombo`
  ADD PRIMARY KEY (`macombo`,`madichvucon`),
  ADD KEY `fk_chitietcombo_dichvucon` (`madichvucon`);

--
-- Indexes for table `chitietdatlich`
--
ALTER TABLE `chitietdatlich`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_chitietdatlich` (`madatlich`,`madichvu`),
  ADD KEY `idx_chitietdatlich_datlich` (`madatlich`),
  ADD KEY `idx_chitietdatlich_dichvu` (`madichvu`);

--
-- Indexes for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`madanhgia`),
  ADD UNIQUE KEY `uq_danhgia_datlich` (`madatlich`),
  ADD KEY `idx_danhgia_datlich` (`madatlich`);

--
-- Indexes for table `datlich`
--
ALTER TABLE `datlich`
  ADD PRIMARY KEY (`madatlich`),
  ADD UNIQUE KEY `uq_datlich_code` (`codedatlich`),
  ADD KEY `idx_datlich_nguoidung` (`manguoidung`),
  ADD KEY `idx_datlich_thucung` (`mathucung`),
  ADD KEY `idx_datlich_nhanvien` (`manhanvien`),
  ADD KEY `idx_datlich_ngayhen` (`ngayhen`),
  ADD KEY `idx_datlich_trangthai` (`trangthaidatlich`),
  ADD KEY `idx_datlich_thanhtoan` (`trangthaithanhtoan`);

--
-- Indexes for table `dichvu`
--
ALTER TABLE `dichvu`
  ADD PRIMARY KEY (`madichvu`);

--
-- Indexes for table `giadichvu`
--
ALTER TABLE `giadichvu`
  ADD PRIMARY KEY (`magiadichvu`),
  ADD UNIQUE KEY `uq_giadichvu_mucgia` (`madichvu`,`cannangtu`,`cannangden`),
  ADD KEY `idx_giadichvu_dichvu` (`madichvu`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`manguoidung`),
  ADD UNIQUE KEY `uq_nguoidung_email` (`email`),
  ADD UNIQUE KEY `uq_nguoidung_sodienthoai` (`sodienthoai`),
  ADD UNIQUE KEY `uq_nguoidung_googleid` (`googleid`);

--
-- Indexes for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`manhanvien`),
  ADD UNIQUE KEY `uq_nhanvien_sodienthoai` (`sodienthoai`),
  ADD UNIQUE KEY `uq_nhanvien_email` (`email`);

--
-- Indexes for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`mathanhtoan`),
  ADD UNIQUE KEY `uq_thanhtoan_vnp_txn_ref` (`vnp_txn_ref`),
  ADD UNIQUE KEY `uq_thanhtoan_vnp_transaction_no` (`vnp_transaction_no`),
  ADD KEY `idx_thanhtoan_datlich` (`madatlich`),
  ADD KEY `idx_thanhtoan_trangthai` (`trangthai`);

--
-- Indexes for table `thucung`
--
ALTER TABLE `thucung`
  ADD PRIMARY KEY (`mathucung`),
  ADD KEY `idx_thucung_nguoidung` (`manguoidung`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chitietdatlich`
--
ALTER TABLE `chitietdatlich`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `madanhgia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `datlich`
--
ALTER TABLE `datlich`
  MODIFY `madatlich` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dichvu`
--
ALTER TABLE `dichvu`
  MODIFY `madichvu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `giadichvu`
--
ALTER TABLE `giadichvu`
  MODIFY `magiadichvu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `manguoidung` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nhanvien`
--
ALTER TABLE `nhanvien`
  MODIFY `manhanvien` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `mathanhtoan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thucung`
--
ALTER TABLE `thucung`
  MODIFY `mathucung` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chitietcombo`
--
ALTER TABLE `chitietcombo`
  ADD CONSTRAINT `fk_chitietcombo_combo` FOREIGN KEY (`macombo`) REFERENCES `dichvu` (`madichvu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chitietcombo_dichvucon` FOREIGN KEY (`madichvucon`) REFERENCES `dichvu` (`madichvu`) ON UPDATE CASCADE;

--
-- Constraints for table `chitietdatlich`
--
ALTER TABLE `chitietdatlich`
  ADD CONSTRAINT `fk_chitietdatlich_datlich` FOREIGN KEY (`madatlich`) REFERENCES `datlich` (`madatlich`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chitietdatlich_dichvu` FOREIGN KEY (`madichvu`) REFERENCES `dichvu` (`madichvu`) ON UPDATE CASCADE;

--
-- Constraints for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `fk_danhgia_datlich` FOREIGN KEY (`madatlich`) REFERENCES `datlich` (`madatlich`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datlich`
--
ALTER TABLE `datlich`
  ADD CONSTRAINT `fk_datlich_nguoidung` FOREIGN KEY (`manguoidung`) REFERENCES `nguoidung` (`manguoidung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_datlich_nhanvien` FOREIGN KEY (`manhanvien`) REFERENCES `nhanvien` (`manhanvien`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_datlich_thucung` FOREIGN KEY (`mathucung`) REFERENCES `thucung` (`mathucung`) ON UPDATE CASCADE;

--
-- Constraints for table `giadichvu`
--
ALTER TABLE `giadichvu`
  ADD CONSTRAINT `fk_giadichvu_dichvu` FOREIGN KEY (`madichvu`) REFERENCES `dichvu` (`madichvu`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `fk_thanhtoan_datlich` FOREIGN KEY (`madatlich`) REFERENCES `datlich` (`madatlich`) ON UPDATE CASCADE;

--
-- Constraints for table `thucung`
--
ALTER TABLE `thucung`
  ADD CONSTRAINT `fk_thucung_nguoidung` FOREIGN KEY (`manguoidung`) REFERENCES `nguoidung` (`manguoidung`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
