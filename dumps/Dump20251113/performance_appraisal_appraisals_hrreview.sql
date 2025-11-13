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
-- Table structure for table `appraisals_hrreview`
--

DROP TABLE IF EXISTS `appraisals_hrreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisals_hrreview` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `remarks_hr` longtext NOT NULL,
  `casual_leave_taken` int NOT NULL,
  `sick_leave_taken` int NOT NULL,
  `annual_leave_taken` int NOT NULL,
  `on_time_count` int NOT NULL,
  `delay_count` int NOT NULL,
  `early_exit_count` int NOT NULL,
  `current_basic` int NOT NULL,
  `promo_with_increment_proposed_basic` int NOT NULL,
  `promo_without_increment_proposed_basic` int NOT NULL,
  `increment_proposed_basic` int NOT NULL,
  `pp_proposed_basic` int NOT NULL,
  `promo_w_increment` tinyint(1) NOT NULL,
  `promo_w_increment_remarks` longtext,
  `promo_w_pp` tinyint(1) NOT NULL,
  `promo_w_pp_remarks` longtext,
  `increment_w_no_promo` tinyint(1) NOT NULL,
  `increment_w_no_promo_remarks` longtext,
  `pp_only` tinyint(1) NOT NULL,
  `pp_only_remarks` longtext,
  `deferred` tinyint(1) NOT NULL,
  `deferred_remarks` longtext,
  `remarks_on_your_decision` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `appraisal_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appraisal_id` (`appraisal_id`),
  CONSTRAINT `appraisals_hrreview_appraisal_id_6613a32d_fk_appraisal` FOREIGN KEY (`appraisal_id`) REFERENCES `appraisals_employeeappraisal` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appraisals_hrreview`
--

LOCK TABLES `appraisals_hrreview` WRITE;
/*!40000 ALTER TABLE `appraisals_hrreview` DISABLE KEYS */;
/*!40000 ALTER TABLE `appraisals_hrreview` ENABLE KEYS */;
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
