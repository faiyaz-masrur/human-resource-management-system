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
-- Table structure for table `appraisals_employeeappraisalstatus`
--

DROP TABLE IF EXISTS `appraisals_employeeappraisalstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisals_employeeappraisalstatus` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appraisal_date` date DEFAULT NULL,
  `self_appraisal_done` varchar(10) DEFAULT NULL,
  `rm_review_done` varchar(10) DEFAULT NULL,
  `hr_review_done` varchar(10) DEFAULT NULL,
  `hod_review_done` varchar(10) DEFAULT NULL,
  `coo_review_done` varchar(10) DEFAULT NULL,
  `ceo_review_done` varchar(10) DEFAULT NULL,
  `employee_id` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  CONSTRAINT `appraisals_employeea_employee_id_7ba76f0f_fk_system_em` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appraisals_employeeappraisalstatus`
--

LOCK TABLES `appraisals_employeeappraisalstatus` WRITE;
/*!40000 ALTER TABLE `appraisals_employeeappraisalstatus` DISABLE KEYS */;
INSERT INTO `appraisals_employeeappraisalstatus` VALUES (1,NULL,'PENDING','NA','NA','NA','NA','NA','9EOJP'),(2,'2025-03-01','PENDING','NA','NA','NA','NA','NA','1120'),(3,'2025-05-01','PENDING','NA','NA','NA','NA','NA','1130'),(4,'2026-11-01','PENDING','NA','NA','NA','PENDING','PENDING','1140'),(5,'2026-11-01','PENDING','NA','PENDING','NA','PENDING','PENDING','1150'),(6,'2025-11-01','PENDING','PENDING','PENDING','NA','PENDING','PENDING','1160');
/*!40000 ALTER TABLE `appraisals_employeeappraisalstatus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:17
