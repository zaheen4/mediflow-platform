-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: mediflowdb
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS mediflowdb;
USE mediflowdb;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `equipment_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,'Personal Erotective Equipment(PPE)','Disposable Protective PPE Coverall Kit with Hood Basic SMS Coverall.',109.72,3400,'https://s.alicdn.com/@sc04/kf/H1b7bea3d035e4b74b633c571796f0c1aT.jpg?avif=close'),(2,'X-Ray Machine','RD-865Z Medical Equipment 65KW floor-mounted digital radiography dr xray system.',1218972.10,1,'https://s.alicdn.com/@sc04/kf/Hfebda6707eaa4f07803ee3f753f6bd87C.png_720x720q50.jpg'),(3,'Disposable Surgical Instrument Set','Basic General Surgical Instrument Set Orthopedic Medical Emergency Operations First Aid Made of Steel and Stainless Material',242599.94,5,'https://s.alicdn.com/@sc04/kf/Hc3cddb4bd5504846918202419583baf0A.jpg?avif=close'),(4,'Automatic Blood Cell Analyzer','Medical Blood Test CBC Analyzer Fully Auto 5 Part Hematology Analyzer',60954.60,1,'https://s.alicdn.com/@sc04/kf/H02b4dbfe426744cb8aebebe740315d48p.jpg?avif=close'),(5,'Multi-Parameter Patient Monitor','Tracks ECG, SpO2, blood pressure, and temperature.',19505.48,1,'https://s.alicdn.com/@sc04/kf/H8b82fba83e0b419ca78c13424ae74b72F.png_720x720q50.jpg'),(6,'ICU Ventilator','Critical care ventilator with modes for COVID-19/pneumonia patients.',18286.38,1,'https://s.alicdn.com/@sc04/kf/Hff1caf581c944b8cbaa7031c7cef5f57c.jpg_720x720q50.jpg'),(7,'Electric Dental Chair','Adjustable chair with built-in suction and light for dental procedures.',146291.04,1,'https://s.alicdn.com/@sc04/kf/H47b677b7eba045adb40f4f51b0352895l.jpg_720x720q50.jpg'),(8,'Disposable Syringes','Sterile, single-use syringes for injections/vaccinations.',3.66,10000,'https://s.alicdn.com/@sc04/kf/H2147f8d228a249f8986e78b5c4cb61ddL.jpg_720x720q50.jpg'),(9,'Steam Autoclave Sterilizer','For sterilizing surgical tools and lab equipment.',84970.72,2,'https://s.alicdn.com/@sc04/kf/H370c965278ce461b9429950c7fad8b43e.jpg_720x720q50.jpg'),(10,'Electric Hospital Bed','Adjustable bed with remote control for patient comfort.',5485.92,2,'https://s.alicdn.com/@sc04/kf/Hce20e2fee8c045848eed340f6c928173d.jpg_720x720q50.jpg'),(11,'Stethoscope','EVA Material Hard Shell Waterproof Stethoscope Case Littmann',363.30,1,'https://s.alicdn.com/@sc04/kf/HTB1kil_atfvK1RjSszhq6AcGFXa9.jpg_720x720q50.jpg'),(12,'Blood Pressure Monitor','Electronic portable arm ambulatory blood pressure monitor digital sphygmomanometer',1462.92,20,'https://s.alicdn.com/@sc04/kf/H8958888dcc604a6db029684058e247bfI.jpg_720x720q50.jpg'),(13,'Glucometer','Glucometer cholesterol high accuracy glucose meter blood glucose cholesterol uric acid meter with test strips',865.56,500,'https://s.alicdn.com/@sc04/kf/H7fe4a3feb53f4e7182546657bb4f4fa6h.jpg_720x720q50.jpg'),(14,'Pulse Oximeter','Mini Small Size Healthcare Low-power consumption display SpO2 Pulse Monitoring finger pulse oximeter',633.93,1000,'https://s.alicdn.com/@sc04/kf/Hb5e8a260c0b045b893c55d39bd52aacax.png_720x720q50.jpg'),(15,'ECG Machine','Wellue ER1-LW Single-Lead 24/72 Hour Portable Holter Ecg Patch Ecg Holter Monitor Wireless Ecg Electrodes Heart Rate Monitor',42546.39,1,'https://s.alicdn.com/@sc04/kf/H9c595052cdd24d509c01ae9973f171d5t.jpg_720x720q50.jpg'),(16,'Defibrillator (AED)','SY-C025-1 AED Trainer Portable Automated Defibrillator Monitor Daily Training External Defibrillator',12069.04,1,'https://s.alicdn.com/@sc04/kf/Hdce5eca2a3f149bdbf3340015d657142B.jpg_720x720q50.jpg'),(17,'Nebulizer','Medical air compressor nebulizer OEM hospital inhalador machine steam nebulizer machine for children',1414.15,8,'https://s.alicdn.com/@sc04/kf/H94cb1e28d88e4fd28d93eacccc8c141b9.jpg_720x720q50.jpg'),(18,'Oxygen Concentrator','Portable 3L 5L Oxygen Generator Physical Therapy Equipments Oxygen Device 5L Medical Homecare Oxygen Concentrator Mobile',38889.10,1,'https://lifeplusmedical.com/wp-content/uploads/2021/04/Oxygen-concentrator-Grafix.jpg'),(19,'Infusion Pump','Portable Cheap Price Medical Vet Apparatus Equipment Compact Veterinary Infusion Pump With Fluid Warmer',21821.79,1,'https://s.alicdn.com/@sc04/kf/Hb4bb1f2f397c40609465583313ad5bc0x.jpg_720x720q50.jpg'),(20,'Surgical Masks (Box)','Manufacturers Custom Adult En14683 Anti Dust Disposable Face Mask 3 Ply Dental Medical Surgical Masks',58.52,200,'https://s.alicdn.com/@sc04/kf/H2f26272f2b3549158682954d166beaeaS.jpg_720x720q50.jpg');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User') NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin99','$2b$12$K776sSIbwNIBiAH0GMx3BumOKfx7z/bhJgv4LO.fGvS3fRNA9sQXq','Admin','admin99@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-06 22:00:53
