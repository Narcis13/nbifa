CREATE TABLE `tipuridocumente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `denumire` varchar(45) NOT NULL,
  `tip` varchar(1) NOT NULL DEFAULT 'i',
  `denumire_scurta` varchar(15) NOT NULL,
  `prioritate` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SELECT * FROM bifa.tipuridocumente;

