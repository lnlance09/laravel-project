# ************************************************************
# Sequel Ace SQL dump
# Version 3030
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: blather_laravel
# Generation Time: 2021-07-08 18:14:17 +0000
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

INSERT INTO `users` (`id`, `bio`, `email`, `email_verified_at`, `gender`, `img`, `name`, `password`, `username`, `remember_token`, `created_at`, `updated_at`)
VALUES
	(1,'','alvina.marvin@example.org','2021-02-07 11:15:17','male','users/ZXNMbsFEQq5otEClT5e9iO0z.jpg','Sammie Schumm','BHvmfvukfbr','neha.schultz','xBzWPL9RnB','2020-11-27 08:47:18','2021-07-08 17:22:25'),
	(2,'','iwyman@example.net','2021-06-15 22:21:53','female','users/8g1cnBx45SxJMYl8cDoPrblt.jpg','Sister Jones','yPZ3JK6JklqstdW10eq0','gibson.laurence','ZhfscNxrPC','2021-03-05 07:18:02','2021-07-08 17:22:25'),
	(3,'','flavie23@example.net','2021-02-21 17:41:56','male','users/XroPY0qXpJhF7WXwstSZCtVn.jpg','Hayley Kulas','OyzUO57r','earnestine59','H292ocnPid','2021-01-19 07:37:09','2021-07-08 17:22:25'),
	(4,'','axel.bergnaum@example.net','2021-06-30 21:01:32','male','users/4Ak24Oza9TBIUcO4jxYiQVVA.jpg','Neal Bergnaum','o7PwY5WfHb','oda.reichert','zuCIpwr7it','2021-06-18 02:27:29','2021-07-08 17:22:25'),
	(5,'','lshanahan@example.org','2021-02-17 19:05:33','female','users/7zZxoUF4alUDFFhLgZITIOrT.jpg','Delia Kuvalis','7bkpAJA0cVyBIhS','rosetta92','bNgjq0iAPH','2020-11-24 05:09:06','2021-07-08 17:22:25'),
	(6,'','zreilly@example.net','2021-04-03 16:39:13','male','users/whhypJUxk9oXgoGQshEJ2ddT.jpg','Raheem Torp','r5Lbo7nHVCXlkswxix','ucasper','jXqWbdrhmm','2020-10-29 03:15:24','2021-07-08 17:22:25'),
	(7,'','jeanette.vonrueden@example.net','2021-06-30 06:50:57','male','users/yprAlX2KiXtypfYDCJpucLEt.jpg','Price Bosco','xMvNDEebBIaoB2','chelsie.stoltenberg','OlG6zRcXNa','2021-06-28 16:53:04','2021-07-08 17:22:25'),
	(8,'','mark22@example.org','2020-11-24 15:28:36','male','users/5Ug1w04IXO05U3fzxa70t1in.jpg','Al Morissette','pyTrl6u7WpjbtI3Lh7Md60zY','kevin.crona','1weaW3kG69','2020-09-22 13:23:31','2021-07-08 17:22:25'),
	(9,'','davon.kilback@example.net','2021-06-30 15:09:08','male','users/qSo0EgSvELZhNa9Z5ERqvZDE.jpg','Filiberto Wilderman','cwK2fBgrtp5IMVAdHSrmClM','bbahringer','MpRZeEh5Fc','2021-05-21 20:08:01','2021-07-08 17:22:25'),
	(10,'','donato10@example.org','2020-06-16 20:23:08','female','users/IvJcnSPlViNRVhjalxUgqXef.jpg','Agustina Reinger','w8v5OmvwFAIRXNt','pmcglynn','Xe01AGJgaL','2020-05-28 08:50:10','2021-07-08 17:22:25'),
	(11,'','ursula.stark@example.com','2020-10-05 01:05:51','female','users/hc03Ue82yvBhW0pamiAcvzlP.jpg','Ludie Romaguera','IqT5N0gzg','hharvey','goT08prg79','2020-06-13 13:02:43','2021-07-08 17:22:25'),
	(12,'','ywyman@example.com','2021-07-08 05:02:01','male','users/TX2Hj06bUA0IKYSxI4aGlWOU.jpg','Rico Runolfsdottir','MnipX6Nw9zs','dach.bulah','sSsAcmarYz','2021-06-12 13:44:39','2021-07-08 17:22:25'),
	(13,'','eichmann.cassandre@example.org','2020-09-07 19:43:54','female','users/nqMiJdmbEowowBdKlUl6qTXg.jpg','Kiera Olson','E3OXATj50b','lbernier','qy6FzQf09r','2020-05-10 17:20:17','2021-07-08 17:22:25'),
	(14,'','braun.antonina@example.net','2021-06-20 18:46:45','male','users/CG33HxkhggX2mKsgybDb6est.jpg','Pietro Jast','sms1k8hJWIOK','gaylord37','TLJxEWcnfp','2021-04-16 09:27:32','2021-07-08 17:22:25'),
	(15,'','damian.langworth@example.org','2021-06-10 06:28:28','female','users/lalHTOivZeVW2fElqdSN2sIb.jpg','Angelica Bode','veuF8M8OkcmMjRGWEw3ezjt','amir56','ClryarKRYk','2021-03-14 02:23:47','2021-07-08 17:22:25'),
	(16,'','howard33@example.org','2021-06-18 14:52:23','male','users/LgeUgayBXR7qttFXsQRblg5u.jpg','Ryder Kirlin','3mih7YnLu8','eino06','sSSpTKwqrs','2021-06-17 13:56:02','2021-07-08 17:22:25'),
	(17,'','mathew.willms@example.org','2021-01-03 22:37:54','female','users/htAZkmRbj7DlyWrle6Pw8jSt.jpg','Janis Steuber','OWS5wEC8wfPf1','belle.zboncak','OoMCfWbecI','2020-11-12 10:25:55','2021-07-08 17:22:25'),
	(18,'','lindsay.crooks@example.com','2021-04-12 21:14:58','female','users/ai3heGtm0N1INFYwEt2HUzRh.jpg','Laurine Rodriguez','VwwLrqBSOdspqASYP6','lpouros','mC10XQ9qwK','2020-07-23 22:34:46','2021-07-08 17:22:25'),
	(19,'','christelle22@example.org','2021-05-29 05:19:05','female','users/YGChT9Zn31Z5cyqDQm8qhXpe.jpg','Imogene Lakin','jLWUbUXyPgsnjn','dorothea68','tmbBPE9flU','2020-06-27 12:38:11','2021-07-08 17:22:25'),
	(20,'','schowalter.everett@example.org','2021-05-09 12:44:20','male','users/UihWrahMDY9NfqWhNjrAetso.jpg','Frederick Kuhlman','GE5DgkMeVnzaWNdn4nB9aXLW','atrantow','xkb0vvOl8F','2021-05-02 10:09:12','2021-07-08 17:22:25'),
	(21,'','jrodriguez@example.net','2021-06-12 11:39:27','female','users/rR9ZvWyn1MD4B2RpWHV7N4Vg.jpg','Destiney Simonis','47KSZ3Wcu2slZwcz6jLAIR3','jairo97','KYSzG1LHLa','2021-05-29 06:11:01','2021-07-08 17:22:25'),
	(22,'','beryl.bartoletti@example.com','2021-05-16 07:57:06','female','users/wKcnY3bH3gmzQHnkhvLVAwzb.jpg','Wava Homenick','iEmh3m1eUAoG4yVL','krajcik.lauren','IwUET3IsI3','2021-02-07 21:11:50','2021-07-08 17:22:25'),
	(23,'','blindgren@example.org','2021-05-08 18:13:51','female','users/KZ2GvVQSzpPB6yOndaKgFLtz.jpg','Sonya Nolan','Sah6W9iSDQDeDjTII','doyle.alycia','86hcbH4iLH','2020-05-08 21:04:08','2021-07-08 17:22:25'),
	(24,'','hettie67@example.net','2020-08-26 10:57:17','male','users/bX8KNT43ti56DovHcSW6tXh9.jpg','Deshaun Becker','lK9f0S6Qmy92WzaC2','anais83','CfalteOcCD','2020-05-15 13:21:29','2021-07-08 17:22:25'),
	(25,'','rohan.leif@example.com','2021-04-19 15:17:03','male','users/cgg9KsuBBWwVA0AX19xnmmHH.jpg','Cameron Carter','3hmp8WkwW16C1','xchamplin','Xk7038znQ5','2021-04-07 14:40:00','2021-07-08 17:22:25');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
