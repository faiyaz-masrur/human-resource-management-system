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
-- Table structure for table `employees_address`
--

DROP TABLE IF EXISTS `employees_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees_address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `present_house` varchar(225) NOT NULL,
  `present_road_block_sector` varchar(50) DEFAULT NULL,
  `present_city_village` varchar(100) NOT NULL,
  `present_postal_code` varchar(20) NOT NULL,
  `permanent_house` varchar(225) NOT NULL,
  `permanent_road_block_sector` varchar(50) DEFAULT NULL,
  `permanent_city_village` varchar(100) NOT NULL,
  `permanent_postal_code` varchar(20) NOT NULL,
  `employee_id` varchar(5) NOT NULL,
  `permanent_district_id` bigint DEFAULT NULL,
  `permanent_police_station_id` bigint DEFAULT NULL,
  `present_district_id` bigint DEFAULT NULL,
  `present_police_station_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `employees_address_permanent_district_i_600a2ad1_fk_system_bd` (`permanent_district_id`),
  KEY `employees_address_permanent_police_sta_ddc2541e_fk_system_bd` (`permanent_police_station_id`),
  KEY `employees_address_present_district_id_059c93a9_fk_system_bd` (`present_district_id`),
  KEY `employees_address_present_police_stati_92a5adc3_fk_system_bd` (`present_police_station_id`),
  CONSTRAINT `employees_address_employee_id_dd68ac23_fk_system_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `system_employee` (`id`),
  CONSTRAINT `employees_address_permanent_district_i_600a2ad1_fk_system_bd` FOREIGN KEY (`permanent_district_id`) REFERENCES `system_bddistrict` (`id`),
  CONSTRAINT `employees_address_permanent_police_sta_ddc2541e_fk_system_bd` FOREIGN KEY (`permanent_police_station_id`) REFERENCES `system_bdthana` (`id`),
  CONSTRAINT `employees_address_present_district_id_059c93a9_fk_system_bd` FOREIGN KEY (`present_district_id`) REFERENCES `system_bddistrict` (`id`),
  CONSTRAINT `employees_address_present_police_stati_92a5adc3_fk_system_bd` FOREIGN KEY (`present_police_station_id`) REFERENCES `system_bdthana` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees_address`
--

LOCK TABLES `employees_address` WRITE;
/*!40000 ALTER TABLE `employees_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `employees_address` ENABLE KEYS */;
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
