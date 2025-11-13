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
-- Table structure for table `system_employee`
--

DROP TABLE IF EXISTS `system_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_employee` (
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `id` varchar(5) NOT NULL,
  `email` varchar(254) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `basic_salary` int DEFAULT NULL,
  `reviewed_by_rm` tinyint(1) NOT NULL,
  `reviewed_by_hr` tinyint(1) NOT NULL,
  `reviewed_by_hod` tinyint(1) NOT NULL,
  `reviewed_by_coo` tinyint(1) NOT NULL,
  `reviewed_by_ceo` tinyint(1) NOT NULL,
  `department_id` bigint DEFAULT NULL,
  `designation_id` bigint DEFAULT NULL,
  `grade_id` bigint DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  `reporting_manager_id` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `system_employee_department_id_dcc8f947_fk_system_department_id` (`department_id`),
  KEY `system_employee_designation_id_ba9d4bd9_fk_system_designation_id` (`designation_id`),
  KEY `system_employee_grade_id_76a0ec1b_fk_system_grade_id` (`grade_id`),
  KEY `system_employee_role_id_875fabf0_fk_system_role_id` (`role_id`),
  KEY `system_employee_reporting_manager_id_90f8d1cd_fk_system_re` (`reporting_manager_id`),
  CONSTRAINT `system_employee_department_id_dcc8f947_fk_system_department_id` FOREIGN KEY (`department_id`) REFERENCES `system_department` (`id`),
  CONSTRAINT `system_employee_designation_id_ba9d4bd9_fk_system_designation_id` FOREIGN KEY (`designation_id`) REFERENCES `system_designation` (`id`),
  CONSTRAINT `system_employee_grade_id_76a0ec1b_fk_system_grade_id` FOREIGN KEY (`grade_id`) REFERENCES `system_grade` (`id`),
  CONSTRAINT `system_employee_reporting_manager_id_90f8d1cd_fk_system_re` FOREIGN KEY (`reporting_manager_id`) REFERENCES `system_reportingmanager` (`manager_id`),
  CONSTRAINT `system_employee_role_id_875fabf0_fk_system_role_id` FOREIGN KEY (`role_id`) REFERENCES `system_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_employee`
--

LOCK TABLES `system_employee` WRITE;
/*!40000 ALTER TABLE `system_employee` DISABLE KEYS */;
INSERT INTO `system_employee` VALUES ('pbkdf2_sha256$1000000$QuzeGcLTN4OhU3CRg9AdMQ$Y/2IiqlUjVlbZEq2iXkOP5J8rDM8r1V02g7aAOPVVFg=',NULL,0,0,1,'1120','faiyaz.masrur@sonaliintellect.com','Faiyaz Masrur','2022-11-10',0,0,0,0,0,0,2,47,15,6,NULL),('pbkdf2_sha256$1000000$ZcR1X3zFT9lmKyKYsnV6Sd$3KRwX2rOMcBtM9ZytAiqBMjaNolVL5FiHzemOsFuMZ8=',NULL,0,0,1,'1130','nafisa.ahmed@sonaliintellect.com','Nafisa Ahmed','2024-05-05',0,0,0,0,0,0,2,46,14,5,NULL),('pbkdf2_sha256$1000000$1h203hhN5Dn8p5NhKziqXm$PK/AkedbT0kMrmtYw8gj2PxrNkcNXrVfJ2uOeMvnpVs=',NULL,0,0,1,'1140','saim.selim@sonaliintellect.com','Saim Selim','2025-11-13',300000,0,0,0,1,1,2,45,13,3,'1130'),('pbkdf2_sha256$1000000$EFvwvXvo88jlzuSCD5IPp4$zc0oJ8DdF70VkYEKsTQUBE9v+cQgimEkXeM9jGq/11o=',NULL,0,0,1,'1150','touhidur.rahman@sonaliintellect.com','Touhidur Rahman','2025-11-13',200000,0,1,0,1,1,4,39,9,2,'1140'),('pbkdf2_sha256$1000000$0yWBWneiizTwQYN7vZZnlI$EeW1zzu/sXpAEhD1KSW+n8zaEY36h10NdfV3smy4hxs=',NULL,0,0,1,'1160','mostaqeem.billah@sonaliintellect.com','Mostaqeem Billah','2024-11-04',100000,1,1,0,1,1,4,1,1,1,'1150'),('pbkdf2_sha256$1000000$wnVfYZR1wtrmw9TWHQnqgD$RiEipe8Tgb//NGHZM3GEYMblh1ZvH3DR4wKnpW6CdG0=',NULL,1,1,1,'9EOJP','noreply@sonaliintellect.com',NULL,NULL,0,0,0,0,0,0,NULL,NULL,NULL,7,NULL);
/*!40000 ALTER TABLE `system_employee` ENABLE KEYS */;
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
