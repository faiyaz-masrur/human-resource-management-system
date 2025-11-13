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
-- Table structure for table `system_specialization`
--

DROP TABLE IF EXISTS `system_specialization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_specialization` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_specialization`
--

LOCK TABLES `system_specialization` WRITE;
/*!40000 ALTER TABLE `system_specialization` DISABLE KEYS */;
INSERT INTO `system_specialization` VALUES (1,'CSE','Computer Science & Engineering'),(2,'CS','Computer Science'),(3,'IT','Information Technology'),(4,'EEE','Electrical & Electronic Engineering'),(5,'CE','Civil Engineering'),(6,'ME','Mechanical Engineering'),(7,'IPE','Industrial & Production Engineering'),(8,'FIN','Finance'),(9,'MKT','Marketing'),(10,'HR','Human Resources'),(11,'ACC','Accounting'),(12,'ECON','Economics'),(13,'LAW','Law'),(14,'ENG','English'),(15,'BAN','Bangla'),(16,'PHIL','Philosophy'),(17,'HIS','History'),(18,'SOC','Sociology'),(19,'PSCI','Political Science'),(20,'PHYS','Physics'),(21,'CHEM','Chemistry'),(22,'MATH','Mathematics'),(23,'BIO','Biology'),(24,'STAT','Statistics'),(25,'MED','Medicine'),(26,'PHARMA','Pharmacy'),(27,'NURS','Nursing'),(28,'ARCH','Architecture'),(29,'FINEART','Fine Arts'),(30,'EDU','Education');
/*!40000 ALTER TABLE `system_specialization` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:18
