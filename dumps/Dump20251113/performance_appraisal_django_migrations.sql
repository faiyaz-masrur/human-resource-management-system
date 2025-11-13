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
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-11-13 07:39:53.354862'),(2,'contenttypes','0002_remove_content_type_name','2025-11-13 07:39:53.460416'),(3,'auth','0001_initial','2025-11-13 07:39:53.748687'),(4,'auth','0002_alter_permission_name_max_length','2025-11-13 07:39:53.876139'),(5,'auth','0003_alter_user_email_max_length','2025-11-13 07:39:53.885368'),(6,'auth','0004_alter_user_username_opts','2025-11-13 07:39:53.896003'),(7,'auth','0005_alter_user_last_login_null','2025-11-13 07:39:53.912705'),(8,'auth','0006_require_contenttypes_0002','2025-11-13 07:39:53.917376'),(9,'auth','0007_alter_validators_add_error_messages','2025-11-13 07:39:53.928793'),(10,'auth','0008_alter_user_username_max_length','2025-11-13 07:39:53.941240'),(11,'auth','0009_alter_user_last_name_max_length','2025-11-13 07:39:53.954166'),(12,'auth','0010_alter_group_name_max_length','2025-11-13 07:39:53.970945'),(13,'auth','0011_update_proxy_permissions','2025-11-13 07:39:53.981615'),(14,'auth','0012_alter_user_first_name_max_length','2025-11-13 07:39:53.991351'),(15,'system','0001_initial','2025-11-13 07:39:55.894962'),(16,'admin','0001_initial','2025-11-13 07:39:56.082087'),(17,'admin','0002_logentry_remove_auto_add','2025-11-13 07:39:56.095454'),(18,'admin','0003_logentry_add_action_flag_choices','2025-11-13 07:39:56.111209'),(19,'appraisals','0001_initial','2025-11-13 07:39:56.310410'),(20,'appraisals','0002_initial','2025-11-13 07:39:58.644297'),(21,'attendance','0001_initial','2025-11-13 07:39:58.691815'),(22,'attendance','0002_initial','2025-11-13 07:39:58.937043'),(23,'django_apscheduler','0001_initial','2025-11-13 07:39:59.131929'),(24,'django_apscheduler','0002_auto_20180412_0758','2025-11-13 07:39:59.200500'),(25,'django_apscheduler','0003_auto_20200716_1632','2025-11-13 07:39:59.227312'),(26,'django_apscheduler','0004_auto_20200717_1043','2025-11-13 07:39:59.481161'),(27,'django_apscheduler','0005_migrate_name_to_id','2025-11-13 07:39:59.517097'),(28,'django_apscheduler','0006_remove_djangojob_name','2025-11-13 07:39:59.578769'),(29,'django_apscheduler','0007_auto_20200717_1404','2025-11-13 07:39:59.660927'),(30,'django_apscheduler','0008_remove_djangojobexecution_started','2025-11-13 07:39:59.730191'),(31,'django_apscheduler','0009_djangojobexecution_unique_job_executions','2025-11-13 07:39:59.756947'),(32,'employees','0001_initial','2025-11-13 07:39:59.924610'),(33,'employees','0002_initial','2025-11-13 07:40:01.550009'),(34,'notifications','0001_initial','2025-11-13 07:40:01.574261'),(35,'notifications','0002_initial','2025-11-13 07:40:01.692243'),(36,'sessions','0001_initial','2025-11-13 07:40:01.737861'),(37,'token_blacklist','0001_initial','2025-11-13 07:40:02.019080'),(38,'token_blacklist','0002_outstandingtoken_jti_hex','2025-11-13 07:40:02.116005'),(39,'token_blacklist','0003_auto_20171017_2007','2025-11-13 07:40:02.160140'),(40,'token_blacklist','0004_auto_20171017_2013','2025-11-13 07:40:02.266677'),(41,'token_blacklist','0005_remove_outstandingtoken_jti','2025-11-13 07:40:02.347337'),(42,'token_blacklist','0006_auto_20171017_2113','2025-11-13 07:40:02.392848'),(43,'token_blacklist','0007_auto_20171017_2214','2025-11-13 07:40:02.673649'),(44,'token_blacklist','0008_migrate_to_bigautofield','2025-11-13 07:40:03.053436'),(45,'token_blacklist','0010_fix_migrate_to_bigautofield','2025-11-13 07:40:03.099738'),(46,'token_blacklist','0011_linearizes_history','2025-11-13 07:40:03.102861'),(47,'token_blacklist','0012_alter_outstandingtoken_user','2025-11-13 07:40:03.141179'),(48,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2025-11-13 07:40:03.178346');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
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
