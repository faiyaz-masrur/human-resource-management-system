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
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(27,'appraisals','appraisaldetails'),(28,'appraisals','appraisaldetailsbackup'),(29,'appraisals','ceoreview'),(30,'appraisals','cooreview'),(31,'appraisals','employeeappraisal'),(32,'appraisals','employeeappraisalstatus'),(33,'appraisals','employeeappraisaltimer'),(34,'appraisals','hodreview'),(35,'appraisals','hrreview'),(36,'appraisals','reportingmanagerreview'),(46,'attendance','attendanceevent'),(47,'attendance','employeeattendance'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(44,'django_apscheduler','djangojob'),(45,'django_apscheduler','djangojobexecution'),(37,'employees','address'),(38,'employees','attatchment'),(39,'employees','education'),(40,'employees','personaldetail'),(41,'employees','trainingcertificate'),(42,'employees','workexperience'),(43,'notifications','notification'),(5,'sessions','session'),(9,'system','bddistrict'),(26,'system','bdthana'),(10,'system','bloodgroup'),(20,'system','ceo'),(21,'system','coo'),(11,'system','degree'),(12,'system','department'),(13,'system','designation'),(14,'system','emergencycontactrelationship'),(8,'system','employee'),(15,'system','grade'),(22,'system','hod'),(23,'system','hr'),(16,'system','maritalstatus'),(24,'system','reportingmanager'),(17,'system','role'),(25,'system','rolepermission'),(18,'system','specialization'),(19,'system','trainingtype'),(6,'token_blacklist','blacklistedtoken'),(7,'token_blacklist','outstandingtoken');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 14:24:18
