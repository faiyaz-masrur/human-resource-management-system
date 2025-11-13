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
-- Table structure for table `system_bddistrict`
--

DROP TABLE IF EXISTS `system_bddistrict`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_bddistrict` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_bddistrict`
--

LOCK TABLES `system_bddistrict` WRITE;
/*!40000 ALTER TABLE `system_bddistrict` DISABLE KEYS */;
INSERT INTO `system_bddistrict` VALUES (1,'Narsingdi',NULL),(2,'Gazipur',NULL),(3,'Shariatpur',NULL),(4,'Narayanganj',NULL),(5,'Tangail',NULL),(6,'Kishoreganj',NULL),(7,'Manikganj',NULL),(8,'Dhaka',NULL),(9,'Munshiganj',NULL),(10,'Rajbari',NULL),(11,'Madaripur',NULL),(12,'Gopalganj',NULL),(13,'Faridpur',NULL),(14,'Comilla',NULL),(15,'Feni',NULL),(16,'Brahmanbaria',NULL),(17,'Rangamati',NULL),(18,'Noakhali',NULL),(19,'Chandpur',NULL),(20,'Lakshmipur',NULL),(21,'Chittagong',NULL),(22,'Coxsbazar',NULL),(23,'Khagrachhari',NULL),(24,'Bandarban',NULL),(25,'Sirajganj',NULL),(26,'Pabna',NULL),(27,'Bogra',NULL),(28,'Rajshahi',NULL),(29,'Natore',NULL),(30,'Joypurhat',NULL),(31,'Chapainawabganj',NULL),(32,'Naogaon',NULL),(33,'Jessore',NULL),(34,'Satkhira',NULL),(35,'Meherpur',NULL),(36,'Narail',NULL),(37,'Chuadanga',NULL),(38,'Kushtia',NULL),(39,'Magura',NULL),(40,'Khulna',NULL),(41,'Bagerhat',NULL),(42,'Jhenaidah',NULL),(43,'Jhalakathi',NULL),(44,'Patuakhali',NULL),(45,'Pirojpur',NULL),(46,'Barisal',NULL),(47,'Bhola',NULL),(48,'Barguna',NULL),(49,'Panchagarh',NULL),(50,'Dinajpur',NULL),(51,'Lalmonirhat',NULL),(52,'Nilphamari',NULL),(53,'Gaibandha',NULL),(54,'Thakurgaon',NULL),(55,'Rangpur',NULL),(56,'Kurigram',NULL),(57,'Sylhet',NULL),(58,'Moulvibazar',NULL),(59,'Habiganj',NULL),(60,'Sunamganj',NULL),(61,'Sherpur',NULL),(62,'Mymensingh',NULL),(63,'Jamalpur',NULL),(64,'Netrokona',NULL);
/*!40000 ALTER TABLE `system_bddistrict` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:15
