DROP TABLE IF EXISTS `stari_documente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stari_documente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stare` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stari_documente`
--

LOCK TABLES `stari_documente` WRITE;
/*!40000 ALTER TABLE `stari_documente` DISABLE KEYS */;
INSERT INTO `stari_documente` VALUES (1,'INITIAT(Asteapta aprobare)'),(2,'APROBAT'),(3,'IN DERULARE'),(4,'FINALIZAT'),(5,'INACTIV');
/*!40000 ALTER TABLE `stari_documente` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `antetrn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `antetrn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `obiect_achizitie` varchar(65) DEFAULT NULL,
  `valoare` decimal(14,2) DEFAULT NULL,
  `id_compartiment` int(11) NOT NULL,
  `id_stare` int(11) NOT NULL,
  `data_creere` datetime DEFAULT NULL,
  `data_modificare` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `antetrn`
--

LOCK TABLES `antetrn` WRITE;
/*!40000 ALTER TABLE `antetrn` DISABLE KEYS */;
/*!40000 ALTER TABLE `antetrn` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `detaliirn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detaliirn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_Antet` int(11) NOT NULL,
  `idpozPAAP` int(11) NOT NULL,
  `denumire` varchar(128) DEFAULT NULL,
  `codcpv` varchar(45) DEFAULT NULL,
  `detalii_tehnice` varchar(512) DEFAULT NULL,
  `cantitate` decimal(14,2) DEFAULT NULL,
  `pret` decimal(14,2) DEFAULT NULL,
  `valoare` decimal(14,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detaliirn`
--

LOCK TABLES `detaliirn` WRITE;
/*!40000 ALTER TABLE `detaliirn` DISABLE KEYS */;
/*!40000 ALTER TABLE `detaliirn` ENABLE KEYS */;
UNLOCK TABLES;