CREATE DATABASE  IF NOT EXISTS `budget_tracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `budget_tracker`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: budget_tracker
-- ------------------------------------------------------
-- Server version	5.7.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book_invite`
--

DROP TABLE IF EXISTS `book_invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_invite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inviter_id` int(11) NOT NULL,
  `invitee_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `last_modified_time` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT '0: pending, -1: reject, 1: accept, 2: revoke',
  `other` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_inviter` (`inviter_id`),
  KEY `idx_invitee` (`invitee_id`),
  KEY `idx_book` (`book_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_invite`
--

LOCK TABLES `book_invite` WRITE;
/*!40000 ALTER TABLE `book_invite` DISABLE KEYS */;
INSERT INTO `book_invite` VALUES (1,1,2,1,'2022-05-14 17:22:00','2022-05-14 17:22:00',1,NULL),(3,6,1,9,'2022-05-19 15:58:56','2022-05-19 17:41:41',-1,NULL),(4,6,1,10,'2022-05-19 16:00:58','2022-05-19 17:41:44',1,NULL),(5,6,1,13,'2022-05-19 23:36:56','2022-05-19 23:37:08',1,NULL),(6,1,6,1,'2022-05-20 17:28:36','2022-05-21 01:24:30',2,NULL),(7,6,1,12,'2022-05-21 13:19:05','2022-05-24 15:34:20',2,NULL),(9,1,6,2,'2022-05-24 15:33:55','2022-05-24 15:39:11',2,NULL),(10,6,1,12,'2022-05-24 15:39:40','2022-05-24 15:39:40',0,NULL);
/*!40000 ALTER TABLE `book_invite` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-24 15:48:18
