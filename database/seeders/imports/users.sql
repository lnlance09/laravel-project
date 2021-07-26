# ************************************************************
# Sequel Ace SQL dump
# Version 3030
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: preditc
# Generation Time: 2021-07-25 16:48:10 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table users
# ------------------------------------------------------------

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `api_token`, `bio`, `email`, `email_verified_at`, `gender`, `has_api_access`, `img`, `name`, `password`, `remember_token`, `username`, `verification_code`, `created_at`, `updated_at`)
VALUES
	(1,NULL,'','sawayn.zena@example.com','2021-04-22 10:00:21','male',1,'users/6x9yaoQiCnpGrntaG10Dbs1L.jpg','Camron Treutel','qEbeyxH5gNBiZYQ',NULL,'camron.treutel8365',NULL,'2021-01-16 01:27:22','2021-07-21 20:26:12'),
	(2,NULL,'','gutkowski.bell@example.org','2021-06-12 02:59:16','male',1,'users/5FLp3EogCBPi01fXSUTnWkPw.jpg','Bartholome Moore','EtcvPUU7',NULL,'bartholome-moore3248',NULL,'2021-04-12 10:53:21','2021-07-21 20:26:12'),
	(3,NULL,'','cjenkins@example.org','2020-08-24 00:34:19','male',1,'users/wRGA1AB5lJnjVOg2GKy99ELl.jpg','Lincoln Kiehn','VRzFIikiZqCR9S3lekc9MUy',NULL,'lincoln_kiehn1236',NULL,'2020-06-23 02:58:24','2021-07-21 20:26:12'),
	(4,NULL,'','adolph77@example.com','2020-10-29 15:40:38','male',1,'users/kbjN3lXhoScAH0yrLjTrEYE7.jpg','Ellsworth Pagac','0jQGWKfXApj',NULL,'ellsworth_pagac4569',NULL,'2020-07-10 11:04:22','2021-07-21 20:26:12'),
	(5,NULL,'','jconroy@example.net','2021-02-28 05:56:36','male',1,'users/RJQBY7jZhT7vYWFDunU11JJF.jpg','Noel Rohan','XuBD2pSW2iGege',NULL,'noel-rohan9154',NULL,'2020-10-25 18:38:42','2021-07-21 20:26:12'),
	(6,NULL,'','madisen16@example.com','2020-09-11 22:28:43','female',1,'users/JE0ZT3ydORVyJM0qauVKlI9q.jpg','Kasandra Walsh','7sKLKX7KrNfs8',NULL,'kasandra-walsh8356',NULL,'2020-07-08 22:52:12','2021-07-21 20:26:12'),
	(7,NULL,'','emmerich.morton@example.com','2020-08-20 18:02:43','male',1,'users/Ga8F7yNItlOL9M1WhcZQDzkB.jpg','Derek Thiel','oIiDYOSGFgeAb8',NULL,'derek-thiel1679',NULL,'2020-06-30 15:12:13','2021-07-21 20:26:12'),
	(8,NULL,'','peggie.runolfsson@example.org','2021-02-09 05:57:10','male',1,'users/f61RXJz65hiyDa6vkStBanKJ.jpg','Olen Roberts','ALMhvyaD6b2jKOcQmaM',NULL,'olen_roberts7043',NULL,'2020-06-16 11:32:22','2021-07-21 20:26:12'),
	(9,NULL,'','mreichel@example.net','2020-12-07 19:46:52','male',1,'users/gu4Wsc4hXhV5OM5mg6JBjEZM.jpg','Blair Ledner','2DJJn1gupZ6uimOJ',NULL,'blair-ledner4359',NULL,'2020-07-07 17:12:57','2021-07-21 20:26:12'),
	(10,NULL,'','buckridge.keely@example.org','2021-06-14 06:19:14','male',1,'users/M5VZGUalpxlXRLT4x4drRyJO.jpg','Deontae White','IEU2r5DNRqrUP35XPo5DR2',NULL,'deontae-white7816',NULL,'2021-03-22 19:41:30','2021-07-21 20:26:12'),
	(11,NULL,'','aarmstrong@example.org','2021-07-07 11:27:19','male',1,'users/cL0RTV7ByKPNRYhjkNmMw8mD.jpg','Scot Walker','okRSsXMj5s',NULL,'scot_walker7388',NULL,'2021-02-08 10:28:17','2021-07-21 20:26:12'),
	(12,NULL,'','tito.adams@example.com','2021-05-20 10:18:00','female',1,'users/obz7WuWPDLIzD9Joq67oB2ld.jpg','Mayra Haag','asGhXefpRm58jZdnNFp',NULL,'mayra.haag3281',NULL,'2021-02-27 23:27:21','2021-07-21 20:26:12'),
	(13,NULL,'','tobin91@example.org','2021-01-13 09:38:00','female',1,'users/0aVeYQKfOT4XR1uTSWMd9YKG.jpg','Marian Bernier','3GAacJYSGlnch',NULL,'marian-bernier8853',NULL,'2020-08-17 16:24:39','2021-07-21 20:26:12'),
	(14,NULL,'','jay.ledner@example.org','2021-06-28 23:23:18','female',1,'users/FIa114GdhK2RxNIkvcFOKstM.jpg','Catharine Vandervort','HlCrgu5GtFIupdBzGNA',NULL,'catharine.vandervort6757',NULL,'2021-06-27 20:22:53','2021-07-21 20:26:12'),
	(15,NULL,'','jewell31@example.net','2021-05-29 07:59:59','male',1,'users/2vvDwE5vfCzlCcYegz2UnmwH.jpg','Joaquin Schaden','qybxmH83OxD0beDzuWzeD',NULL,'joaquin_schaden3905',NULL,'2021-04-16 12:27:16','2021-07-21 20:26:12'),
	(16,NULL,'','elyssa.hahn@example.com','2021-07-06 04:49:34','male',1,'users/ErSufdKqErOv0IEO1JhM35vd.jpg','Vinnie O\'Hara','Ee1Ix2ImOmvXt983ANOeY',NULL,'vinnie.o\'hara2748',NULL,'2021-04-25 15:06:27','2021-07-21 20:26:12'),
	(17,NULL,'','mertz.garfield@example.net','2021-07-03 19:25:12','male',1,'users/eJRpDjQyMbBPUJqXIlAF0MvB.jpg','Hector Grant','GOvUUsQSZaJwAhbjA',NULL,'hector-grant3058',NULL,'2020-08-28 01:41:26','2021-07-21 20:26:12'),
	(18,NULL,'','senger.madeline@example.com','2021-02-28 04:49:11','male',1,'users/ddci6YXPoYBRHYe4jvtOoGCT.jpg','Domenick Davis','XS1l25yCbaCah',NULL,'domenick_davis4315',NULL,'2021-01-09 18:05:23','2021-07-21 20:26:12'),
	(19,NULL,'','otha.brekke@example.net','2021-07-15 21:31:56','female',1,'users/CtOSZ3p7UCFcKILWPqPHAcRb.jpg','Minerva Sporer','uiEJBCSU3YdiZslaVm',NULL,'minerva_sporer4134',NULL,'2021-06-28 09:58:27','2021-07-21 20:26:12'),
	(20,NULL,'','ava60@example.com','2020-11-30 15:50:50','male',1,'users/1oD9uNPo5w0pnrwNrQuQb9rj.jpg','Garnet White','BnoAP2OrHc1htcmjVQM',NULL,'garnet.white442',NULL,'2020-08-14 20:07:51','2021-07-21 20:26:12'),
	(21,NULL,'','nfadel@example.com','2021-05-25 11:17:38','male',1,'users/4kCiuNrsFIbGxjuHLHnPTO1v.jpg','Edward Kuhic','Yow0viAVyEg6zA',NULL,'edward.kuhic163',NULL,'2021-05-19 22:00:56','2021-07-21 20:26:12'),
	(22,NULL,'','blanda.theresa@example.org','2021-03-18 13:53:56','male',1,'users/EcNfg7WHKnOEyxjq4NMebRBh.jpg','Santa Russel','Al6pj09NbfBikSk1buZJ0Ogi',NULL,'santa_russel5517',NULL,'2021-01-20 02:18:02','2021-07-21 20:26:12'),
	(23,NULL,'','hickle.marlen@example.net','2021-07-07 10:55:12','female',1,'users/1BeBrS44shO8zKKRvPdfnmBC.jpg','Jenifer Senger','nyaBb4h52pd8gE',NULL,'jenifer_senger2041',NULL,'2020-10-05 16:00:01','2021-07-21 20:26:12'),
	(24,NULL,'','josianne.franecki@example.org','2020-11-13 22:26:14','male',1,'users/cnNTHoL2zcMyfEfOgMa0VuWZ.jpg','Jamir Beer','eSq79dL4Tohm5eIMD5WPpl2',NULL,'jamir_beer6514',NULL,'2020-11-03 21:06:42','2021-07-21 20:26:12'),
	(25,NULL,'','bahringer.grant@example.com','2021-06-29 11:14:22','male',1,'users/yCMJWCbJVnVFu8hqzeRNduXz.jpg','Jared Ryan','D7TGcwx8ofLLf7uTKiLBC',NULL,'jared-ryan9388',NULL,'2021-04-18 03:19:53','2021-07-21 20:26:12'),
	(28,'BfrOCiiM95vOLWLSqBMAMfMkVYQR8qy7rNiNzuJNEVgRT22USfqu9g5SzVfR',NULL,'lnlance09@gmail.com','2021-07-25 16:34:49','male',NULL,'avatar/large/chris.jpg','wwwsr pp','logicandtruth1',NULL,'lnlance09','4318','2021-07-23 19:25:46','2021-07-25 16:34:49'),
	(29,'xjCICyXhlpeYRVIGzA9NOPw3h7LTIdKRUY5bTbcRspX1oNB1RQnjl0c84kvq',NULL,'lnlance0922@gmail.com',NULL,'male',NULL,'avatar/large/chris.jpg','lance','logicandtruth1',NULL,'coinx','6539','2021-07-25 14:40:41','2021-07-25 14:40:41'),
	(30,'1iw7BBrWg3QN02Ie4LTzsPvyQnDBJMpljkGcLes6UwauzHkCJai0k4Pt8hbG',NULL,'lnlance09eee@gmail.com',NULL,'male',NULL,'avatar/large/chris.jpg','lance','logicandtruth1',NULL,'coinxxx','9436','2021-07-25 14:46:52','2021-07-25 14:46:52');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
