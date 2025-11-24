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
-- Table structure for table `appraisals_appraisaldetailsbackup`
--

DROP TABLE IF EXISTS `appraisals_appraisaldetailsbackup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisals_appraisaldetailsbackup` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appraisal_start_date` date DEFAULT NULL,
  `appraisal_end_date` date DEFAULT NULL,
  `factor` decimal(10,2) NOT NULL,
  `employee_id` varchar(5) NOT NULL,
  `reporting_manager_id` varchar(5) DEFAULT NULL,
  `ceo_review_id` bigint DEFAULT NULL,
  `coo_review_id` bigint DEFAULT NULL,
  `emp_appraisal_id` bigint DEFAULT NULL,
  `hod_review_id` bigint DEFAULT NULL,
  `hr_review_id` bigint DEFAULT NULL,
  `rm_review_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ceo_review_id` (`ceo_review_id`),
  UNIQUE KEY `coo_review_id` (`coo_review_id`),
  UNIQUE KEY `emp_appraisal_id` (`emp_appraisal_id`),
  UNIQUE KEY `hod_review_id` (`hod_review_id`),
  UNIQUE KEY `hr_review_id` (`hr_review_id`),
  UNIQUE KEY `rm_review_id` (`rm_review_id`),
  KEY `appraisals_appraisal_employee_id_e181175b_fk_system_em` (`employee_id`),
  KEY `appraisals_appraisal_reporting_manager_id_edff65b3_fk_system_re` (`reporting_manager_id`),
  CONSTRAINT `appraisals_appraisal_ceo_review_id_a4e96a8d_fk_appraisal` FOREIGN KEY (`ceo_review_id`) REFERENCES `appraisals_ceoreview` (`id`),
  CONSTRAINT `appraisals_appraisal_coo_review_id_3c25f14f_fk_appraisal` FOREIGN KEY (`coo_review_id`) REFERENCES `appraisals_cooreview` (`id`),
  CONSTRAINT `appraisals_appraisal_emp_appraisal_id_ce08953a_fk_appraisal` FOREIGN KEY (`emp_appraisal_id`) REFERENCES `appraisals_employeeappraisal` (`id`),
  CONSTRAINT `appraisals_appraisal_employee_id_e181175b_fk_system_em` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`),
  CONSTRAINT `appraisals_appraisal_hod_review_id_f4002843_fk_appraisal` FOREIGN KEY (`hod_review_id`) REFERENCES `appraisals_hodreview` (`id`),
  CONSTRAINT `appraisals_appraisal_hr_review_id_434d25e0_fk_appraisal` FOREIGN KEY (`hr_review_id`) REFERENCES `appraisals_hrreview` (`id`),
  CONSTRAINT `appraisals_appraisal_reporting_manager_id_edff65b3_fk_system_re` FOREIGN KEY (`reporting_manager_id`) REFERENCES `system_reportingmanager` (`manager_id`),
  CONSTRAINT `appraisals_appraisal_rm_review_id_b5564ada_fk_appraisal` FOREIGN KEY (`rm_review_id`) REFERENCES `appraisals_reportingmanagerreview` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appraisals_appraisaldetailsbackup`
--

LOCK TABLES `appraisals_appraisaldetailsbackup` WRITE;
/*!40000 ALTER TABLE `appraisals_appraisaldetailsbackup` DISABLE KEYS */;
/*!40000 ALTER TABLE `appraisals_appraisaldetailsbackup` ENABLE KEYS */;
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
