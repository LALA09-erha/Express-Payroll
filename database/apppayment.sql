-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 29, 2023 at 04:49 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apppayment`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_fav`
--

CREATE TABLE `email_fav` (
  `IDEMAIL` int(11) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `IDUSER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_fav`
--

INSERT INTO `email_fav` (`IDEMAIL`, `EMAIL`, `IDUSER`) VALUES
(1, 'mineerha@gmail.com', 58),
(2, 'lanabogel4@gmail.com', 58),
(3, 'lanabogel5@gmail.com', 59),
(5, 'fikri@gmail.com', 60),
(6, 'erhacaca@gmail.com', 60);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `IDTRANSAKSI` int(11) NOT NULL,
  `IDUSER` int(11) DEFAULT NULL,
  `TOTALTRANSAKSI` varchar(255) DEFAULT NULL,
  `SESSIONID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`IDTRANSAKSI`, `IDUSER`, `TOTALTRANSAKSI`, `SESSIONID`) VALUES
(110, 59, '100', '1677743968'),
(111, 59, '100', '1678188320'),
(112, 59, '109', '1678189166'),
(142, 60, '11111', '1685156915'),
(144, 60, '1000', '1685193245'),
(145, 60, '323131', '1685193327'),
(147, 60, '100000', '1687242602'),
(148, 60, '10000', '1690166561'),
(149, 63, '1000', '1690181096'),
(150, 60, '1000', '1690182134');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_detail`
--

CREATE TABLE `transaksi_detail` (
  `IDTDETAIL` int(11) NOT NULL,
  `IDUSER` int(11) DEFAULT NULL,
  `IDTRANSAKSI` int(11) DEFAULT NULL,
  `JENIS_TRANSAKSI` char(100) DEFAULT NULL,
  `JUMLAH_TRANSAKSI` varchar(255) DEFAULT NULL,
  `SESSIONID` varchar(255) DEFAULT NULL,
  `VERIFIKASI` varchar(10) DEFAULT NULL,
  `KODE_REFERRAL` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi_detail`
--

INSERT INTO `transaksi_detail` (`IDTDETAIL`, `IDUSER`, `IDTRANSAKSI`, `JENIS_TRANSAKSI`, `JUMLAH_TRANSAKSI`, `SESSIONID`, `VERIFIKASI`, `KODE_REFERRAL`) VALUES
(174, 59, 110, 'Penginputan', '96000000', '1677743968', '1', 'X28cwhX'),
(175, 59, 110, 'Penginputan', '4000000', '1677743968', '1', 'X28cwhX'),
(176, 59, 111, 'Penginputan', '9000000', '1678188320', '1', 'X20besX'),
(177, 59, 111, 'Penginputan', '1000000', '1678188320', '1', 'X20besX'),
(178, 59, 112, 'Penginputan', '2000000', '1678189166', '1', '11'),
(179, 59, 112, 'Penginputan', '105000000', '1678189166', '1', 'X26TZyX'),
(234, 60, 142, 'Penarikan', '11000000', '1685156915', '0', '11'),
(236, 60, 144, 'Penarikan', '10000000', '1685193245', '1', '038429'),
(237, 60, 145, 'Pemasukan', '10000000', '1685193327', '0', '516653'),
(240, 60, 147, 'Pemasukan', '3000000', '1687242602', '1', '016480'),
(241, 60, 148, 'Penarikan', '4000000', '1690166561', '1', '140085'),
(242, 60, 148, 'Pemasukan', '3000000', '1690166561', '0', '140085'),
(243, 60, 148, 'Penarikan', '2000000', '1690166561', '0', '140085'),
(244, 60, 148, 'Pemasukan', '1000000', '1690166561', '0', '140085'),
(245, 63, 149, 'Penarikan', '1000000', '1690181096', '1', '328732'),
(246, 60, 150, 'Penarikan', '1000000', '1690182134', '0', '182615');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `IDUSER` int(11) NOT NULL,
  `ROLE` char(50) DEFAULT NULL,
  `USERNAME` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT NULL,
  `UPDATE_AT` timestamp NULL DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`IDUSER`, `ROLE`, `USERNAME`, `PASSWORD`, `CREATED_AT`, `UPDATE_AT`, `EMAIL`) VALUES
(1, 'Admin', 'erha', '1', '2021-06-12 14:41:30', '2021-12-16 06:20:42', 'keluarga.erha@gmail.com'),
(57, 'Guest', 'wawa', '1', '2023-01-19 17:13:59', '2023-01-19 17:13:59', 'keluarga@gmail.com'),
(58, 'Guest', 'lana', 'lana', '2023-01-30 13:48:07', '2023-01-30 13:48:07', 'lana@gmail.com'),
(59, 'Guest', 'lanaa', 'lana', '2023-01-30 14:28:51', '2023-01-30 14:28:51', 'lanaa@gmail.com'),
(60, 'Admin', 'sasa', '$2b$10$PxtOwVvwKV5qzRN/qYi8yuBcMlU7mRwJ/g.vHlxQSnXc8iUpcAks.', '2023-05-24 14:50:39', '2023-05-24 14:50:39', 'wexewob929@lieboe.com'),
(61, 'Guest', 'dafa', '$2b$10$Z30AsUxpC8i61sUuc.p1p.NbqVzqfCofIMxj/h8oesbqGu6X8EXEC', '2023-06-20 06:29:11', '2023-06-20 06:29:11', 'dada@gmail.com'),
(62, 'Guest', 'embek_pote', '$2b$10$vZ3aurGrrl2gODBnrUIiEODJIL8oCoa0sorDAqzY57/r2EFtz6IfS', '2023-07-24 02:44:16', '2023-07-24 02:44:16', 'datara@gmail.com'),
(63, 'Admin', 'shofiahardii', '$2b$10$9CzM/cLuw5HvzJg5KPHO0eQmI1T.tX9fXQjlZMZLLK6BDvSwuXLyW', '2023-07-24 06:40:23', '2023-07-24 06:40:23', 'shofiahardii@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_fav`
--
ALTER TABLE `email_fav`
  ADD PRIMARY KEY (`IDEMAIL`),
  ADD KEY `IDUSER` (`IDUSER`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`IDTRANSAKSI`),
  ADD UNIQUE KEY `TRANSAKSI_PK` (`IDTRANSAKSI`),
  ADD KEY `RELATIONSHIP_1_FK` (`IDUSER`);

--
-- Indexes for table `transaksi_detail`
--
ALTER TABLE `transaksi_detail`
  ADD PRIMARY KEY (`IDTDETAIL`),
  ADD UNIQUE KEY `TRANSAKSI_DETAIL_PK` (`IDTDETAIL`),
  ADD KEY `RELATIONSHIP_2_FK` (`IDUSER`),
  ADD KEY `RELATIONSHIP_3_FK` (`IDTRANSAKSI`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`IDUSER`),
  ADD UNIQUE KEY `USERS_PK` (`IDUSER`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_fav`
--
ALTER TABLE `email_fav`
  MODIFY `IDEMAIL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `IDTRANSAKSI` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `transaksi_detail`
--
ALTER TABLE `transaksi_detail`
  MODIFY `IDTDETAIL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=247;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `IDUSER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_fav`
--
ALTER TABLE `email_fav`
  ADD CONSTRAINT `email_fav_ibfk_1` FOREIGN KEY (`IDUSER`) REFERENCES `users` (`IDUSER`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `FK_TRANSAKS_RELATIONS_USERS` FOREIGN KEY (`IDUSER`) REFERENCES `users` (`IDUSER`);

--
-- Constraints for table `transaksi_detail`
--
ALTER TABLE `transaksi_detail`
  ADD CONSTRAINT `FK_TRANSAKS_RELATIONS_TRANSAKS` FOREIGN KEY (`IDTRANSAKSI`) REFERENCES `transaksi` (`IDTRANSAKSI`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
