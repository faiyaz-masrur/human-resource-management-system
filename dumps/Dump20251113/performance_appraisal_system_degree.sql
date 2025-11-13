-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: performance_appraisal
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `system_degree`
--

DROP TABLE IF EXISTS `system_degree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_degree` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_degree`
--

LOCK TABLES `system_degree` WRITE;
/*!40000 ALTER TABLE `system_degree` DISABLE KEYS */;
INSERT INTO `system_degree` VALUES (1,'SSC','Secondary School Certificate'),(2,'HSC','Higher Secondary Certificate'),(3,'DIPLOMA','Diploma'),(4,'BSC','Bachelor of Science'),(5,'BA','Bachelor of Arts'),(6,'BBA','Bachelor of Business Administration'),(7,'BSS','Bachelor of Social Science'),(8,'LLB','Bachelor of Laws'),(9,'MBBS','Bachelor of Medicine, Bachelor of Surgery'),(10,'BEng','Bachelor of Engineering'),(11,'BArch','Bachelor of Architecture'),(12,'BCom','Bachelor of Commerce'),(13,'MSC','Master of Science'),(14,'MA','Master of Arts'),(15,'MBA','Master of Business Administration'),(16,'MSS','Master of Social Science'),(17,'LLM','Master of Laws'),(18,'MEng','Master of Engineering'),(19,'MArch','Master of Architecture'),(20,'MCom','Master of Commerce'),(21,'MPhil','Master of Philosophy'),(22,'PhD','Doctor of Philosophy'),(23,'POSTDOC','Postdoctoral Research');
/*!40000 ALTER TABLE `system_degree` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:16
