-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 23 Feb 2019 la 15:03
-- Versiune server: 10.1.19-MariaDB
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bifa`
--

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `gestiuni`
--

CREATE TABLE `gestiuni` (
  `id` int(10) UNSIGNED NOT NULL,
  `denumire` varchar(255) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `gestionar` varchar(70) DEFAULT NULL,
  `r_presedinte` varchar(255) DEFAULT NULL,
  `r_membru1` varchar(255) DEFAULT NULL,
  `r_membru2` varchar(255) DEFAULT NULL,
  `r_membru3` varchar(255) DEFAULT NULL,
  `i_presedinte` varchar(255) DEFAULT NULL,
  `i_membru1` varchar(255) DEFAULT NULL,
  `i_membru2` varchar(255) DEFAULT NULL,
  `i_membru3` varchar(255) DEFAULT NULL,
  `stare` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `gestiuni`
--

INSERT INTO `gestiuni` (`id`, `denumire`, `userid`, `gestionar`, `r_presedinte`, `r_membru1`, `r_membru2`, `r_membru3`, `i_presedinte`, `i_membru1`, `i_membru2`, `i_membru3`, `stare`, `created_at`, `updated_at`) VALUES
(1, 'INFORMATICA', 2, 'Doanta Madalin', 'Ec. Brindusescu Narcis', 'MIrica Mihai', 'Serban Madalin', NULL, NULL, NULL, NULL, NULL, 'activ', '2019-01-31 00:00:00', '2019-01-31 00:00:00'),
(2, 'TEHNIC', 3, 'Dodenciu Flori', 'pr1', 'rm1', 'rm2', 'rm3', 'ip', 'im1', 'im2', 'im3', 'activ', '2019-02-06 17:12:11', '2019-02-06 17:12:11'),
(3, 'FARMACIA', 3, 'Cojocaru Adrian', 'asd', 'asd', 'asd', 'asd', 'asdas', 'asda', 'asdas', 'asdas', 'activ', '2019-02-18 18:29:29', '2019-02-18 18:29:29'),
(4, 'LABORATOR', 7, 'Pcc Godeanu Ionela', 'fdsa', 'sdf', 'sdf', 'sdf', '', '', '', '', 'activ', '2019-02-18 20:55:21', '2019-02-18 20:55:21');

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20180925231211_utilizatori.js', 1, '2018-09-25 20:21:43'),
(2, '20180927184515_cu_stare.js', 2, '2018-09-27 15:47:22'),
(3, '20181010191234_user_add_rol.js', 3, '2018-10-10 16:13:25'),
(4, '20190127225501_gestiuni.js', 4, '2019-01-27 20:59:27');

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `public_id` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `user`
--

INSERT INTO `user` (`id`, `public_id`, `name`, `password`, `admin`) VALUES
(1, '9cd93dc9-657c-47da-824f-63363ba95af5', 'admin', 'sha256$SE6GePYL$e51b9b0aec076e618a7b04d3627a7d8a75a4348a5dcd56e8f4fa0644e7ca9720', 1),
(2, '7fb0b26d-5ce5-4abc-aca3-6feb16a25c7b', 'operator', 'sha256$wZhRAWOh$29ea5e0e938b999107afce50dddf84875fcc6847c5afebf6e3a0743faf09f209', 0),
(3, '3dd39c19-4404-447d-b5e1-e8c295ae4948', 'gogu', 'sha256$6zjgYz8u$3c8cf0d8df0e22c9fddfeddb68acb6aa907d150534b3535aaa593ac5d5a76caf', 0);

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `utilizatori`
--

CREATE TABLE `utilizatori` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `stare` varchar(255) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `utilizatori`
--

INSERT INTO `utilizatori` (`id`, `username`, `password`, `name`, `email`, `created_at`, `updated_at`, `stare`, `rol`) VALUES
(1, 'test', 'test1', 'nume', 'iemail', NULL, NULL, NULL, 'admin'),
(2, 'test2', 'test2', 'fdsasdasdf', 'asdfasdfasdfasd', NULL, NULL, 'asdfasdfasdf', 'contabil'),
(3, 'Miki', '123456', 'zcxvxcvx', 'xzcvxcvzz', '2018-10-19 14:58:47', '2018-10-19 14:58:47', 'activ', 'admin'),
(6, 'Petrica', 'erwertwwertwerte', 'wertwertwertwer', 'wertwertwertwert', '2018-10-28 14:33:09', '2018-10-28 14:33:09', 'activ', 'wertwertwertwertwert'),
(7, 'Cici', '123456', 'fdfdfgsdgsdfg', 'sdfgsdgsdfgsdfg', '2019-01-19 17:57:52', '2019-01-19 17:57:52', 'activ', 'admin'),
(8, 'Cola', '12345', 'sdfasdfsd asdfasdfasdf', 'asdfasdf asdf asdf asdf', '2019-02-18 17:33:15', '2019-02-18 17:33:15', 'activ', 'cva');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gestiuni`
--
ALTER TABLE `gestiuni`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `public_id` (`public_id`);

--
-- Indexes for table `utilizatori`
--
ALTER TABLE `utilizatori`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gestiuni`
--
ALTER TABLE `gestiuni`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `utilizatori`
--
ALTER TABLE `utilizatori`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
