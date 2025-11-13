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
-- Table structure for table `system_designation`
--

DROP TABLE IF EXISTS `system_designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_designation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `grade_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `system_designation_grade_id_e3d08de9_fk_system_grade_id` (`grade_id`),
  CONSTRAINT `system_designation_grade_id_e3d08de9_fk_system_grade_id` FOREIGN KEY (`grade_id`) REFERENCES `system_grade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_designation`
--

LOCK TABLES `system_designation` WRITE;
/*!40000 ALTER TABLE `system_designation` DISABLE KEYS */;
INSERT INTO `system_designation` VALUES (1,'Engineering Trainee','Engineering Trainee',1),(2,'Trainee-IT','Trainee IT',1),(3,'Trainee-MGT','Trainee MGT',1),(4,'Product Engineer','Product Engineer',2),(5,'SQA Engineer','SQA Engineer',2),(6,'Technical Writer','Technical Writer',2),(7,'System Eng-DevOps/Network/IT/DBA','System Eng-DevOps/Network/IT/DBA',2),(8,'Executive','Executive',2),(9,'Associate Product Engineer','Associate Product Engineer',3),(10,'Associate SQA Engineer','Associate SQA Engineer',3),(11,'Associate Technical Writer','Associate Technical Writer',3),(12,'Associate System Eng-DevOps/Network/IT/DBA','Associate System Eng-DevOps/Network/IT/DBA',3),(13,'Sr. Executive','Senior Executive',3),(14,'Sr. Product Engineer','Senior Product Engineer',4),(15,'Sr. SQA Engineer','Senior SQA Engineer',4),(16,'Sr. Technical Writer','Senior Technical Writer',4),(17,'Sr. System Eng-DevOps/Network/IT/DBA','Senior System Eng-DevOps/Network/IT/DBA',4),(18,'Sr. Principal Executive','Senior Principal Executive',4),(19,'Solution Engineer','Solution Engineer',5),(20,'SQA Analyst','SQA Analyst',5),(21,'Business Analyst','Business Analyst',5),(22,'System Architect-DevOps/Network/IT/DBA','System Architect-DevOps/Network/IT/DBA',5),(23,'Assistant Manager','Assistant Manager',5),(24,'Technical Architect','Technical Architect',6),(25,'Sr. SQA Analyst','Sr. SQA Analyst',6),(26,'Sr. Business Analyst','Sr. Business Analyst',6),(27,'Sr. System Architect-DevOps/Network/IT/DBA','Senior System Architect-DevOps/Network/IT/DBA',6),(28,'Deputy Manager','Deputy Manager',6),(29,'Product Manager','Product Manager',7),(30,'SQA Manager','SQA Manage',7),(31,'Project Manager','Project Manager',7),(32,'Manager-DevOps/Network/IT/DBA','Manager-DevOps/Network/IT/DBA',7),(33,'Manager','Manager',7),(34,'Sr. Product Manager','Senior Product Manager',8),(35,'Sr. SQA Manager','Senior SQA Manage',8),(36,'Sr. Project Manager','Senior Project Manager',8),(37,'Sr. Manager-DevOps/Network/IT/DBA','Senior Manager-DevOps/Network/IT/DBA',8),(38,'Sr. Manager','Senior Manager',8),(39,'Executive Project Manager','Executive Project Manager',9),(40,'Executive Manager-DevOps/Network/IT/DBA','Executive Manager-DevOps/Network/IT/DBA',9),(41,'Executive Manager','Executive Manager',9),(42,'AVP','Assistant Vice President',10),(43,'VP','Vice President',11),(44,'SVP','Senior Vice President',12),(45,'EVP','Executive Vice President',13),(46,'COO','Chief Operating Officer',14),(47,'CEO','Chief Executive Officer',15);
/*!40000 ALTER TABLE `system_designation` ENABLE KEYS */;
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
