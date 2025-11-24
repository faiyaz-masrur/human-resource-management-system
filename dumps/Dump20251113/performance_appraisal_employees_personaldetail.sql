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
-- Table structure for table `employees_personaldetail`
--

DROP TABLE IF EXISTS `employees_personaldetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees_personaldetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(15) NOT NULL,
  `personal_email` varchar(254) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `national_id` varchar(20) NOT NULL,
  `passport_number` varchar(20) DEFAULT NULL,
  `spouse_name` varchar(100) DEFAULT NULL,
  `spouse_nid` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_number` varchar(15) DEFAULT NULL,
  `blood_group_id` bigint DEFAULT NULL,
  `emergency_contact_relationship_id` bigint DEFAULT NULL,
  `employee_id` varchar(5) NOT NULL,
  `marital_status_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `national_id` (`national_id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `passport_number` (`passport_number`),
  UNIQUE KEY `spouse_nid` (`spouse_nid`),
  KEY `employees_personalde_blood_group_id_04c0f86e_fk_system_bl` (`blood_group_id`),
  KEY `employees_personalde_emergency_contact_re_43b90e34_fk_system_em` (`emergency_contact_relationship_id`),
  KEY `employees_personalde_marital_status_id_2499b2a0_fk_system_ma` (`marital_status_id`),
  CONSTRAINT `employees_personalde_blood_group_id_04c0f86e_fk_system_bl` FOREIGN KEY (`blood_group_id`) REFERENCES `system_bloodgroup` (`id`),
  CONSTRAINT `employees_personalde_emergency_contact_re_43b90e34_fk_system_em` FOREIGN KEY (`emergency_contact_relationship_id`) REFERENCES `system_emergencycontactrelationship` (`id`),
  CONSTRAINT `employees_personalde_employee_id_9071eae4_fk_system_em` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`),
  CONSTRAINT `employees_personalde_marital_status_id_2499b2a0_fk_system_ma` FOREIGN KEY (`marital_status_id`) REFERENCES `system_maritalstatus` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees_personaldetail`
--

LOCK TABLES `employees_personaldetail` WRITE;
/*!40000 ALTER TABLE `employees_personaldetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `employees_personaldetail` ENABLE KEYS */;
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
