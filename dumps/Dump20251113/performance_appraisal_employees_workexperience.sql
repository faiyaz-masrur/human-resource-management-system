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
-- Table structure for table `employees_workexperience`
--

DROP TABLE IF EXISTS `employees_workexperience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees_workexperience` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `organization` varchar(255) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `responsibilities` longtext,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `employee_id` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employees_workexperi_employee_id_888c3ee1_fk_system_em` (`employee_id`),
  CONSTRAINT `employees_workexperi_employee_id_888c3ee1_fk_system_em` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees_workexperience`
--

LOCK TABLES `employees_workexperience` WRITE;
/*!40000 ALTER TABLE `employees_workexperience` DISABLE KEYS */;
INSERT INTO `employees_workexperience` VALUES (1,'Sonali Intellect Limited','','',NULL,'2025-11-13',NULL,'9EOJP'),(2,'Sonali Intellect Limited','CEO','HR&Admin',NULL,'2022-11-10',NULL,'1120'),(3,'Sonali Intellect Limited','COO','HR&Admin',NULL,'2024-05-05',NULL,'1130'),(4,'Sonali Intellect Limited','EVP','HR&Admin',NULL,'2025-11-13',NULL,'1140'),(5,'Sonali Intellect Limited','Executive Project Manager','R&D',NULL,'2025-11-13',NULL,'1150'),(6,'Sonali Intellect Limited','Engineering Trainee','R&D',NULL,'2024-11-04',NULL,'1160');
/*!40000 ALTER TABLE `employees_workexperience` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:14
