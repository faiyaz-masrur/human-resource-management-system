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
-- Table structure for table `appraisals_appraisaldetails`
--

DROP TABLE IF EXISTS `appraisals_appraisaldetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisals_appraisaldetails` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appraisal_start_date` date DEFAULT NULL,
  `appraisal_end_date` date DEFAULT NULL,
  `factor` decimal(10,2) NOT NULL,
  `employee_id` varchar(5) NOT NULL,
  `reporting_manager_id` varchar(5) DEFAULT NULL,
  `ceo_review_id` bigint DEFAULT NULL,
  `coo_review_id` bigint DEFAULT NULL,
  `emp_appraisal_id` bigint DEFAULT NULL,
  `appraisal_status_id` bigint DEFAULT NULL,
  `hod_review_id` bigint DEFAULT NULL,
  `hr_review_id` bigint DEFAULT NULL,
  `rm_review_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `ceo_review_id` (`ceo_review_id`),
  UNIQUE KEY `coo_review_id` (`coo_review_id`),
  UNIQUE KEY `emp_appraisal_id` (`emp_appraisal_id`),
  UNIQUE KEY `appraisal_status_id` (`appraisal_status_id`),
  UNIQUE KEY `hod_review_id` (`hod_review_id`),
  UNIQUE KEY `hr_review_id` (`hr_review_id`),
  UNIQUE KEY `rm_review_id` (`rm_review_id`),
  KEY `appraisals_appraisal_reporting_manager_id_a6bdd287_fk_system_re` (`reporting_manager_id`),
  CONSTRAINT `appraisals_appraisal_appraisal_status_id_0c9094ae_fk_appraisal` FOREIGN KEY (`appraisal_status_id`) REFERENCES `appraisals_employeeappraisalstatus` (`id`),
  CONSTRAINT `appraisals_appraisal_ceo_review_id_c8f54d52_fk_appraisal` FOREIGN KEY (`ceo_review_id`) REFERENCES `appraisals_ceoreview` (`id`),
  CONSTRAINT `appraisals_appraisal_coo_review_id_022ac798_fk_appraisal` FOREIGN KEY (`coo_review_id`) REFERENCES `appraisals_cooreview` (`id`),
  CONSTRAINT `appraisals_appraisal_emp_appraisal_id_44e4d08c_fk_appraisal` FOREIGN KEY (`emp_appraisal_id`) REFERENCES `appraisals_employeeappraisal` (`id`),
  CONSTRAINT `appraisals_appraisal_employee_id_d655cdbe_fk_system_em` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`),
  CONSTRAINT `appraisals_appraisal_hod_review_id_f4935b0f_fk_appraisal` FOREIGN KEY (`hod_review_id`) REFERENCES `appraisals_hodreview` (`id`),
  CONSTRAINT `appraisals_appraisal_hr_review_id_1dcaf9ff_fk_appraisal` FOREIGN KEY (`hr_review_id`) REFERENCES `appraisals_hrreview` (`id`),
  CONSTRAINT `appraisals_appraisal_reporting_manager_id_a6bdd287_fk_system_re` FOREIGN KEY (`reporting_manager_id`) REFERENCES `system_reportingmanager` (`manager_id`),
  CONSTRAINT `appraisals_appraisal_rm_review_id_edbabc4e_fk_appraisal` FOREIGN KEY (`rm_review_id`) REFERENCES `appraisals_reportingmanagerreview` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appraisals_appraisaldetails`
--

LOCK TABLES `appraisals_appraisaldetails` WRITE;
/*!40000 ALTER TABLE `appraisals_appraisaldetails` DISABLE KEYS */;
INSERT INTO `appraisals_appraisaldetails` VALUES (1,NULL,NULL,0.55,'9EOJP',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(2,'2025-03-01','2025-03-31',0.55,'1120',NULL,NULL,NULL,NULL,2,NULL,NULL,NULL),(3,'2025-05-01','2025-05-31',0.55,'1130',NULL,NULL,NULL,NULL,3,NULL,NULL,NULL),(4,'2026-11-01','2026-11-30',0.55,'1140','1130',NULL,NULL,NULL,4,NULL,NULL,NULL),(5,'2026-11-01','2026-11-30',0.55,'1150','1140',NULL,NULL,NULL,5,NULL,NULL,NULL),(6,'2025-11-01','2025-11-30',0.55,'1160','1150',NULL,NULL,NULL,6,NULL,NULL,NULL);
/*!40000 ALTER TABLE `appraisals_appraisaldetails` ENABLE KEYS */;
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
