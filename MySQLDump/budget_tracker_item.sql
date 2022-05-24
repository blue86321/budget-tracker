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
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` varchar(24) DEFAULT NULL COMMENT 'Income/expense',
  `amount` decimal(19,4) DEFAULT NULL,
  `category` varchar(24) DEFAULT NULL COMMENT 'User customized cateogy',
  `note` varchar(64) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `other` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (20,1,'2022-05-01','expense',28.0000,'Hospital','核酸','2022-05-16 17:46:10',NULL),(21,1,'2022-05-04','expense',1000.0000,'Hospital','in-patient','2022-05-16 17:51:39',NULL),(22,1,'2022-05-07','expense',500.0000,'Food','Treat colleague','2022-05-16 18:01:43',NULL),(23,1,'2022-05-16','expense',3.0000,'Drink','sprite','2022-05-16 18:50:30',NULL),(24,1,'2022-05-16','expense',13.0000,'Drink','Coco milk tea','2022-05-16 19:19:56',NULL),(25,1,'2022-05-16','expense',22.0000,'Food','dinner','2022-05-16 19:20:45',NULL),(26,1,'2022-05-11','expense',15.0000,'Drink','','2022-05-16 19:28:04',NULL),(27,1,'2022-05-09','expense',18.4300,'Food','','2022-05-16 19:35:32',NULL),(28,1,'2022-05-15','expense',28.0000,'Hospital','CRP','2022-05-16 19:36:12',NULL),(29,1,'2022-05-13','expense',28.0000,'Hospital','CRP','2022-05-16 19:39:37',NULL),(31,1,'2022-05-07','expense',20.7800,'Food','','2022-05-16 22:53:54',NULL),(32,1,'2022-05-04','income',99.0000,'Lucky','','2022-05-17 23:24:17',NULL),(33,1,'2022-04-01','income',2410.0000,'Paycheck','','2022-05-17 23:25:15',NULL),(39,6,'2022-05-18','expense',12.0000,'Food','','2022-05-18 21:48:19',NULL),(40,6,'2022-05-18','expense',20.0000,'Other','','2022-05-18 21:49:19',NULL),(41,6,'2022-05-18','expense',32.0000,'Entertainment','party time','2022-05-18 21:52:57',NULL),(42,6,'2022-05-19','expense',700.0000,'Other','','2022-05-19 13:52:34',NULL),(46,6,'2022-05-19','expense',33.0000,'Transport','','2022-05-19 17:02:58',NULL),(47,6,'2022-05-19','expense',332.0000,'Food','','2022-05-19 21:36:03',NULL),(48,6,'2022-05-19','expense',102.0000,'Other','','2022-05-19 21:36:35',NULL),(50,6,'2022-05-19','expense',54.3000,'Transport','Taxi','2022-05-19 21:49:59',NULL),(51,6,'2022-05-18','expense',15.0000,'Food','milk tea','2022-05-19 21:50:25',NULL),(53,1,'2022-05-19','expense',30.0000,'Food','KFC','2022-05-19 21:51:30',NULL),(54,1,'2022-05-22','expense',45.0000,'Hospital','','2022-05-23 02:49:46',NULL);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
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
