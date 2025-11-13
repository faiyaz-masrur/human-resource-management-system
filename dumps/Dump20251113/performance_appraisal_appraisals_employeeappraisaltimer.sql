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
-- Table structure for table `appraisals_employeeappraisaltimer`
--

DROP TABLE IF EXISTS `appraisals_employeeappraisaltimer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisals_employeeappraisaltimer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_self_appraisal_start` date DEFAULT NULL,
  `employee_self_appraisal_end` date DEFAULT NULL,
  `employee_self_appraisal_remind` date DEFAULT NULL,
  `employee_id` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  CONSTRAINT `appraisals_employeea_employee_id_48b5839c_fk_system_em` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appraisals_employeeappraisaltimer`
--

LOCK TABLES `appraisals_employeeappraisaltimer` WRITE;
/*!40000 ALTER TABLE `appraisals_employeeappraisaltimer` DISABLE KEYS */;
INSERT INTO `appraisals_employeeappraisaltimer` VALUES (1,'2025-03-01','2025-03-31','2025-03-15','1120'),(2,'2025-05-01','2025-05-31','2025-05-15','1130'),(3,'2026-11-01','2026-11-30','2026-11-15','1140'),(4,'2026-11-01','2026-11-30','2026-11-15','1150'),(5,'2025-11-01','2025-11-30','2025-11-15','1160');
/*!40000 ALTER TABLE `appraisals_employeeappraisaltimer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:19
