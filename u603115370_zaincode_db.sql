-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 02, 2026 at 01:06 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u603115370_zaincode_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `shortRole` varchar(255) NOT NULL,
  `shortDesc` text NOT NULL,
  `longDesc` longtext NOT NULL,
  `aboutImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`aboutImage`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about`
--

INSERT INTO `about` (`id`, `fullName`, `shortRole`, `shortDesc`, `longDesc`, `aboutImage`, `createdAt`, `updatedAt`) VALUES
(1, 'Zain Ul Abbas', 'MERN Stack Developer', 'Crafting seamless digital experiences with the MERN Stack. I specialize in building robust backends and interactive frontends that users love. Whether it\'s a startup MVP or a complex enterprise tool, I deliver code that scales. Tech Stack: React, Node.js, Express, MongoDB, Tailwind CSS, & Git.', 'With a deep-rooted expertise in the MERN ecosystem, main complex web ecosystems design aur deploy karne ka mahir hon. Meri core strengths mein Restful APIs development, Redux state management, aur NoSQL database optimization shamil hain. Main modern UI/UX principles aur Agile methodologies ko follow karta hon taake end-product hamesha market-ready ho. Currently, I am helping brands scale their digital presence using Next.js, TypeScript, and AWS/Vercel deployments.', '{\"key\":\"about/1769952930497-557034198_122132110490945092_2588801467361906431_n.jpg\",\"url\":\"/uploads/about/1769952930497-557034198_122132110490945092_2588801467361906431_n.jpg\"}', '2026-01-23 19:14:08', '2026-02-04 12:38:46');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `admin_name`, `email`, `refresh_token`, `password`, `createdAt`, `updatedAt`) VALUES
(2, 'zaincode', 'zainabro886@gmail.com', NULL, '$2b$10$Yi7n46DCjl1Zdhiic.1kpuvR5TYkX8NNWKPPFsk8E4.TeHM4l2EaC', '2026-01-23 17:34:57', '2026-01-23 17:34:57');

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL,
  `siteInfoId` int(11) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`id`, `siteInfoId`, `linkedin`, `github`, `facebook`, `instagram`, `email`, `contactPhone`) VALUES
(1, 1, '/contact', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(20) DEFAULT 'unread',
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `isp` varchar(255) DEFAULT NULL,
  `is_replied` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `plan_id`, `full_name`, `email`, `subject`, `message`, `status`, `ip_address`, `user_agent`, `country`, `region`, `city`, `latitude`, `longitude`, `isp`, `is_replied`, `createdAt`, `created_at`, `updated_at`) VALUES
(9, NULL, 'Zain Abro', 'zainabro886@gmail.com', 'Web Development', 'Hello This is Zain Abro Your website is amazing Admin.', 'read', '$2b$10$X6J2heY60.AOQE1MvfMzN.a0COTfeAVamUTF7upLMJIoxDBY7xj1K', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'SG', NULL, 'Singapore', NULL, NULL, NULL, 0, '2026-02-18 15:19:13', '2026-02-18 15:19:13', '2026-02-19 18:27:50'),
(10, NULL, 'Awais', 'abroowais05@gmail.com', 'English', 'Hi Zain kia hall hai', 'read', '$2b$10$UQR8C/uoO.EaZJQwvGbcJumgcrUYAWwF9wUqw.Q7p78jHToG87Rna', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'CY', NULL, NULL, NULL, NULL, NULL, 0, '2026-02-19 18:26:55', '2026-02-19 18:26:55', '2026-02-19 18:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `institutionName` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `fieldStudy` varchar(255) DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `startYear` varchar(50) DEFAULT NULL,
  `endYear` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `eduDesc` text DEFAULT NULL,
  `certificate` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certificate`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `institutionName`, `degree`, `fieldStudy`, `grade`, `startYear`, `endYear`, `location`, `eduDesc`, `certificate`, `createdAt`, `updatedAt`) VALUES
(1, 'Aptech Latifabad', 'ADSE', 'Software Engineering', 'A', '2023', '2026', 'Hyderabad', 'Certified Software Engineering Professional (ADSE - Aptech). I transform complex problems into elegant, functional digital solutions. From conceptualizing database schemas to deploying full-stack web applications, I bring technical precision and creative thinking to every project. ', '{}', '2026-01-23 18:41:54', '2026-01-23 18:41:54');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `status` varchar(50) DEFAULT 'Published',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'What services do you offer as a MERN Stack Developer?', 'I build full-stack web applications using MongoDB, Express.js, React.js, and Node.js. My services include frontend development, backend APIs, database design, authentication systems, and deployment.', 'Published', '2026-02-01 08:08:25', '2026-02-20 06:02:26'),
(2, 'Do you build responsive and mobile-friendly websites?', 'Yes, all my projects are fully responsive and optimized for mobile, tablet, and desktop devices to ensure a smooth user experience across all screen sizes.', 'Published', '2026-02-20 06:02:46', '2026-02-20 06:02:46'),
(3, 'Can you develop custom web applications from scratch?', 'Absolutely. I can design and develop complete custom web applications based on your business requirements, including dashboards, e-commerce platforms, and SaaS products.', 'Published', '2026-02-20 06:03:35', '2026-02-20 06:03:35'),
(4, 'What is your development process?', 'My process includes requirement analysis, UI/UX planning, frontend and backend development, testing, and final deployment. I ensure clean code, scalability, and performance optimization.', 'Published', '2026-02-20 06:03:52', '2026-02-20 06:03:52'),
(5, 'How can I hire you or start a project with you?', 'You can contact me through the contact form or email provided on this website. Share your project details, and I will respond as soon as possible to discuss further steps.', 'Published', '2026-02-20 06:04:15', '2026-02-20 06:04:15');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `title`, `message`, `reference_id`, `is_read`, `createdAt`) VALUES
(1, 'contact_message', 'New Contact Message', 'tera baap sent you a new contact message.', 1, 0, '2026-01-23 17:55:51'),
(2, 'contact_message', 'New Contact Message', 'Ghullam Abbas sent you a new contact message.', 2, 0, '2026-01-23 18:02:07'),
(3, 'contact_message', 'New Contact Message', 'Zain Abro sent you a new contact message.', 3, 0, '2026-01-25 12:31:12'),
(4, 'contact_message', 'New Contact Message', 'Shehzade sent you a new contact message.', 4, 0, '2026-01-25 18:01:28'),
(5, 'contact_message', 'New Contact Message', 'Ghullam Abbas sent you a new contact message.', 5, 0, '2026-02-01 12:39:07'),
(6, 'contact_message', 'New Contact Message', 'Ghullam Abbas sent you a new contact message.', 6, 0, '2026-02-01 12:58:36'),
(7, 'contact_message', 'New Contact Message', 'ZAINUL ABBAS sent you a new contact message.', 7, 0, '2026-02-01 13:04:22'),
(8, 'contact_message', 'New Contact Message', 'Zain Abro sent you a new contact message.', 8, 0, '2026-02-01 13:26:16'),
(9, 'contact_message', 'New Contact Message', 'Zain Abro sent you a new contact message.', 9, 0, '2026-02-18 15:19:13'),
(10, 'contact_message', 'New Contact Message', 'Awais sent you a new contact message.', 10, 0, '2026-02-19 18:26:55');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `planName` varchar(255) NOT NULL,
  `billingCycle` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT '$',
  `featurePoints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`featurePoints`)),
  `shortDesc` text DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `planName`, `billingCycle`, `price`, `currency`, `featurePoints`, `shortDesc`, `createdAt`, `updatedAt`) VALUES
(1, 'basic', 'Monthly', 55000.00, 'Rs', '[{\"name\":\"alsdkfjlas djflskj flasjdf lkasjdf laskjdf\"},{\"name\":\"ladjflask jdflaskd flkas djflkasj dfasjld\"},{\"name\":\"laskdflaskj dflaksjd flaksjdf laskjdf laskjdf lask df\"},{\"name\":\"lasjdflaksjdf laskjf laskjdf alskdjfaslkjdf askd\"}]', 'asjflkasjdflasjflsakjf laskj flaskj flsakj flaskj flaskjf las fjlaskjflsa kdfj aslkdjf lsadjf slakjdf aslkdfjalskdf jlsakdf jlsakdfj lksadjf laskdjflkas djflaskdj f', '2026-01-29 14:24:08', '2026-01-29 14:24:08');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `shortDesc` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `repoLink` varchar(255) DEFAULT NULL,
  `liveDemo` varchar(255) DEFAULT NULL,
  `canonicalUrl` varchar(255) DEFAULT NULL,
  `heroImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`heroImage`)),
  `ogProjectImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ogProjectImage`)),
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `techStack` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`techStack`)),
  `tag` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tag`)),
  `metaKeywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metaKeywords`)),
  `seoTitle` varchar(255) DEFAULT NULL,
  `metaDesc` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `visibility` varchar(50) DEFAULT NULL,
  `estTime` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recent_activities`
--

CREATE TABLE `recent_activities` (
  `id` int(11) NOT NULL,
  `activity_type` varchar(100) NOT NULL,
  `activity_title` varchar(255) NOT NULL,
  `activity_description` text DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `device_info` text DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recent_activities`
--

INSERT INTO `recent_activities` (`id`, `activity_type`, `activity_title`, `activity_description`, `ip_address`, `device_info`, `createdAt`, `created_at`) VALUES
(1, 'ABOUT_ADD', 'About info added', 'Your About section is now live on the portfolio.', '2a02:4780:11:15::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-23 19:14:08', '2026-01-24 07:28:02'),
(2, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section of your portfolio.', '2a02:4780:11:7::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-23 19:24:26', '2026-01-24 07:28:02'),
(3, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-23 20:22:46', '2026-01-24 07:28:02'),
(4, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-23 20:23:10', '2026-01-24 07:28:02'),
(5, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-23 20:25:38', '2026-01-24 07:28:02'),
(6, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:11:5::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-23 21:43:33', '2026-01-24 07:28:02'),
(7, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 08:55:17', '2026-01-25 08:55:17'),
(8, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:11:49', '2026-01-25 09:11:49'),
(9, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:15:58', '2026-01-25 09:15:58'),
(10, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:16:48', '2026-01-25 09:16:48'),
(11, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:16:59', '2026-01-25 09:16:59'),
(12, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:17:12', '2026-01-25 09:17:12'),
(13, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:32:08', '2026-01-25 09:32:08'),
(14, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 09:32:36', '2026-01-25 09:32:36'),
(15, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:11:14', '2026-01-25 10:11:14'),
(16, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:17:23', '2026-01-25 10:17:23'),
(17, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:17:32', '2026-01-25 10:17:32'),
(18, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:19:58', '2026-01-25 10:19:58'),
(19, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:20:46', '2026-01-25 10:20:46'),
(20, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:39:49', '2026-01-25 10:39:49'),
(21, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 10:40:03', '2026-01-25 10:40:03'),
(22, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 11:24:07', '2026-01-25 11:24:07'),
(23, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 11:28:31', '2026-01-25 11:28:31'),
(24, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 11:38:16', '2026-01-25 11:38:16'),
(25, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 11:38:30', '2026-01-25 11:38:30'),
(26, 'PROJECT_UPDATE', 'Project Updated', '\"laskdjfklasdjf lasakjjdfl asdfhklasjfdlkasj df\" updated.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 11:39:10', '2026-01-25 11:39:10'),
(27, 'PROJECT_DELETE', 'Project Deleted', 'Project with ID 1 was deleted.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 11:49:41', '2026-01-25 11:49:41'),
(28, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '195.35.63.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 12:01:36', '2026-01-25 12:01:36'),
(29, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:3:25::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-25 12:26:25', '2026-01-25 12:26:25'),
(30, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d:4::3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-26 10:20:34', '2026-01-26 10:20:34'),
(31, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d:1::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-26 12:49:20', '2026-01-26 12:49:20'),
(32, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d:1::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-26 12:50:10', '2026-01-26 12:50:10'),
(33, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d:1::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-26 12:50:25', '2026-01-26 12:50:25'),
(34, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d:1::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-26 12:50:43', '2026-01-26 12:50:43'),
(35, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:3:25::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-01 13:35:30', '2026-02-01 13:35:30'),
(36, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-01 14:10:49', '2026-02-01 14:10:49'),
(37, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d:1::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-04 12:38:01', '2026-02-04 12:38:01'),
(38, 'ABOUT_UPDATE', 'About info updated', 'You’ve just updated the About section.', '2a02:4780:5d::2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-04 12:38:46', '2026-02-04 12:38:46');

-- --------------------------------------------------------

--
-- Table structure for table `seo_pages`
--

CREATE TABLE `seo_pages` (
  `id` int(11) NOT NULL,
  `siteInfoId` int(11) DEFAULT NULL,
  `pageSlug` varchar(255) NOT NULL,
  `metaTitle` varchar(255) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `metaKeyword` text DEFAULT NULL,
  `canonicalURL` varchar(255) DEFAULT NULL,
  `OGTitle` varchar(255) DEFAULT NULL,
  `OGDescription` text DEFAULT NULL,
  `twitterCardType` varchar(50) DEFAULT NULL,
  `metaRobots` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo_pages`
--

INSERT INTO `seo_pages` (`id`, `siteInfoId`, `pageSlug`, `metaTitle`, `metaDescription`, `metaKeyword`, `canonicalURL`, `OGTitle`, `OGDescription`, `twitterCardType`, `metaRobots`) VALUES
(1, 1, '/about', 'About Zain – MERN Stack Developer & Web Engineer', 'Learn more about Zain, a MERN stack developer specializing in modern web applications, scalable systems, and full-stack solutions using React, Node.js, and MongoDB.\r\n', 'mern stack developer, full stack developer, react developer, node js developer, mongodb developer, web developer portfolio, zaincodes', 'https://violet-clam-712719.hostingersite.com/about', 'About Zain – MERN Stack Developer', 'Discover the journey, skills, and expertise of Zain, a MERN stack developer building modern, scalable, and high-performance web applications.\r\n', 'summary_large_image', 'index, follow'),
(2, 1, '/services', 'Web Development Services MERN Stack Developer  Zaincodes', 'Explore professional web development services by Zain, a MERN stack developer offering full-stack applications, REST APIs, frontend development, and scalable solutions.\r\n', 'web development services, mern stack developer services, full stack web developer, react development services, node js backend development, mongodb database design', 'https://violet-clam-712719.hostingersite.com/services', 'Web Development Services by Zain – MERN Stack Developer', 'Professional MERN stack web development services including frontend, backend, APIs, and scalable full-stack applications.\r\n', 'summary_large_image', 'index, follow'),
(3, 1, '/projects', 'Projects Full Stack MERN Applications by Zain ', 'Browse real-world projects by Zain, a MERN stack developer. Explore full-stack applications built with React, Node.js, Express, and MongoDB.\r\n', 'mern stack projects, full stack developer portfolio, react projects, node js projects, mongodb projects, web development portfolio', 'https://violet-clam-712719.hostingersite.com/services', 'Projects MERN Stack Developer Portfolio', 'Explore a curated collection of full-stack MERN projects showcasing modern web development, clean architecture, and scalable solutions.\r\n', 'summary_large_image', 'index, follow'),
(4, 1, '/contact', 'Contact Zaincodes  MERN Stack Web Developer', 'Get in touch with Zain, a MERN stack developer, to discuss web development projects, collaborations, or full-stack solutions. Quick response guaranteed.\r\n', 'contact web developer, hire mern stack developer, full stack developer contact, web development services contact, zaincodes contact', 'https://violet-clam-712719.hostingersite.com/contact', 'Contact Zaincodes  MERN Stack Developer', 'Looking to hire a MERN stack developer? Contact Zaincodes to start your web development project or collaboration today.\r\n', 'summary_large_image', 'index, follow'),
(5, 1, '/', 'Zaincodes  MERN Stack Developer & Full Stack Web Portfolio', 'Zaincodes is the portfolio of Zain, a MERN stack developer specializing in modern, scalable, and high-performance full-stack web applications.\r\n', 'mern stack developer, full stack web developer, react developer, node js developer, mongodb developer, web developer portfolio, zaincodes', 'https://violet-clam-712719.hostingersite.com/', 'Zaincodes MERN Stack Developer Portfolio', 'Explore the professional portfolio of Zain, a MERN stack developer building modern, scalable, and production-ready web applications.\r\n', 'summary_large_image', 'index, follow'),
(6, 1, '/reviews', 'Client Reviews & Testimonials Trusted MERN Stack Developer Zaincodes', 'Read genuine client reviews and testimonials for Zaincodes, a trusted MERN stack developer known for reliable full-stack web development and quality delivery.\r\n', 'client reviews web developer, mern stack developer reviews, web developer testimonials, full stack developer feedback, software developer reviews, zaincodes reviews', 'https://violet-clam-712719.hostingersite.com/reviews', 'Client Reviews & Testimonials – Zaincodes', 'See what clients and collaborators say about working with Zaincodes, a professional MERN stack developer delivering scalable web solutions.\r\n', 'summary_large_image', 'index, follow');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `shortDesc` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `serviceImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`serviceImage`)),
  `status` varchar(50) DEFAULT 'draft',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_info`
--

CREATE TABLE `site_info` (
  `id` int(11) NOT NULL,
  `websiteName` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `footerText` text DEFAULT NULL,
  `googleAnalytics` varchar(100) DEFAULT NULL,
  `logoImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`logoImage`)),
  `favicon` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`favicon`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_info`
--

INSERT INTO `site_info` (`id`, `websiteName`, `tagline`, `footerText`, `googleAnalytics`, `logoImage`, `favicon`, `createdAt`, `updatedAt`) VALUES
(1, 'zaincodes', 'Building scalable web apps with the MERN stack.', '© 2026 zaincodes. All rights reserved.', 'u7655678767', '{\"key\":\"site/logo/1769949479250-ChatGPT_Image_Jan_26__2026__06_11_23_PM-removebg-preview.png\",\"url\":\"/uploads/site/logo/1769949479250-ChatGPT_Image_Jan_26__2026__06_11_23_PM-removebg-preview.png\"}', '{\"key\":null,\"url\":null}', '2026-01-23 18:38:01', '2026-02-01 12:37:59');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `skillName` varchar(255) NOT NULL,
  `proficiency` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `skillName`, `proficiency`, `createdAt`, `updatedAt`) VALUES
(3, 'React', '90', '2026-01-23 19:15:18', '2026-01-23 19:15:18'),
(5, 'AWS', '50', '2026-01-25 12:38:26', '2026-02-04 12:35:23'),
(6, 'Node', '80', '2026-02-04 12:33:19', '2026-02-04 12:33:37'),
(7, 'Express', '80', '2026-02-04 12:33:47', '2026-02-04 12:33:47'),
(8, 'Framer motion', '65', '2026-02-04 12:34:05', '2026-02-04 12:34:05'),
(9, 'GSAP', '70', '2026-02-04 12:34:20', '2026-02-04 12:34:20'),
(10, 'MongoDB', '70', '2026-02-04 12:36:00', '2026-02-04 12:36:00'),
(11, 'MySQL', '70', '2026-02-04 12:36:10', '2026-02-04 12:36:10'),
(12, 'Git', '80', '2026-02-04 12:36:38', '2026-02-04 12:36:38');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `designationRole` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `clientImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clientImage`)),
  `ratting` int(11) DEFAULT 5,
  `projectId` int(11) DEFAULT NULL,
  `testimonialDate` date DEFAULT NULL,
  `message` text NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `user_agent` text NOT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `pages_visited` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pages_visited`)),
  `first_visit_at` datetime DEFAULT current_timestamp(),
  `last_visit_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`id`, `ip_address`, `user_agent`, `browser`, `os`, `device_type`, `referrer`, `country`, `city`, `pages_visited`, `first_visit_at`, `last_visit_at`, `createdAt`) VALUES
(1, '110.38.248.122', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-23 12:44:02\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 12:46:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 12:46:58\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 12:47:14\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 12:47:34\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 12:57:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:22:40\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:40:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:41:03\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:52:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:57:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:01:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:12:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:13:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:43:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:54:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:01:43\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 18:01:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:39:33\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:39:48\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:43:44\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:56:16\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 18:56:40\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:56:43\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 18:56:48\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 18:56:51\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 18:56:56\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 18:57:06\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 18:58:29\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:58:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:58:50\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 19:00:14\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 19:00:20\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:14:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:14:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:15:24\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:15:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:21:22\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 19:21:55\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:21:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 21:42:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 05:56:39\"}]', '2026-01-23 12:44:02', '2026-01-24 05:56:39', '2026-01-23 12:44:02'),
(2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', 'http://localhost:5173/', 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-23 16:40:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:40:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:43:28\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:43:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:45:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:46:14\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:47:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:47:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:47:40\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 16:52:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 20:20:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 07:06:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 07:10:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 07:10:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 13:38:59\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 13:39:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 13:40:22\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 13:40:49\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 13:42:08\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:20:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:20:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:35:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:43:27\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:47:49\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:47:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:52:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:52:18\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 08:01:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 08:01:49\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 08:32:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 11:23:24\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:50:01\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:50:08\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:53:50\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:54:02\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 13:08:49\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 13:09:52\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 13:23:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:23:31\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 13:24:59\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-25 13:27:03\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-25 13:27:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:27:05\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:47:03\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:57:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:58:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:01:36\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-25 14:01:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:01:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:05:08\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-25 14:09:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:09:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:11:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:12:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:15:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:17:21\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:20:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:23:26\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-25 14:23:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:23:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:25:58\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:29:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:30:16\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:30:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:32:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:33:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:37:59\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:39:57\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:40:14\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:40:27\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:40:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:46:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:47:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:48:28\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-25 14:57:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:57:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 06:38:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 06:51:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 06:52:08\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:01:06\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:01:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:01:14\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:01:57\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:02:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:02:08\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:02:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:02:13\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:06:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:06:26\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:12:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:12:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:14:03\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:14:27\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:31:35\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:33:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:34:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:35:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:35:20\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:37:30\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:37:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:39:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:41:22\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 09:43:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:43:56\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 09:43:57\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:44:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:52:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:59:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:03:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:03:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:03:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:15:01\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:04:22\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:04:38\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:22:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:27:12\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:50:20\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 13:53:57\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 13:56:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 14:01:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 14:16:38\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 14:24:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 14:24:22\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:37:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:33:38\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-01 07:34:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:34:55\"}, {\"page\": \"/contact/1\", \"visited_at\": \"2026-02-01 07:35:40\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:35:40\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:35:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:41:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:49:06\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:50:59\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-01 07:57:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:57:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:57:14\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-01 07:57:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:57:21\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:08:32\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:12:59\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:16:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:16:37\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-01 08:18:32\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:18:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:28:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:32:23\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:44:18\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:10:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:17:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:18:28\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:20:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:20:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:02:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:02:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:02:49\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:03:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:06:23\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:06:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:08:21\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-01 14:08:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:08:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:10:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:02:23\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:02:24\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-04 14:08:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:08:41\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-04 14:08:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:08:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:09:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:18:34\"}]', '2026-01-23 16:40:53', '2026-02-04 14:18:34', '2026-01-23 16:40:53'),
(3, '182.190.218.70', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-23 17:54:31\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 17:54:40\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 17:54:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:54:43\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 17:54:45\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 17:54:45\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 17:54:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 17:54:47\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 17:54:50\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:00:08\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 18:00:11\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 18:00:12\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:05:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:12:14\"}]', '2026-01-23 17:54:31', '2026-01-23 18:12:14', '2026-01-23 17:54:31'),
(4, '119.160.2.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-23 18:22:16\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:24:22\"}]', '2026-01-23 18:22:16', '2026-01-23 18:24:22', '2026-01-23 18:22:16'),
(5, '182.190.218.60', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-23 18:32:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:38:10\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 18:40:01\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 18:41:52\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 18:44:43\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 18:44:58\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 18:47:01\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 18:49:29\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 18:49:47\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 18:52:24\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 18:53:20\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 18:53:46\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 18:53:55\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 18:55:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:55:59\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 18:56:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:56:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 18:58:26\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 18:58:32\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 19:00:22\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 19:01:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:01:14\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:04:35\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 19:07:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:07:11\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:07:11\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 19:07:12\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 19:07:13\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 19:07:14\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:07:15\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 19:07:24\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:07:28\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-23 19:07:29\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:07:35\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 19:19:42\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 19:19:48\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:19:50\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-23 19:19:53\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 19:19:57\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-23 19:20:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-23 19:22:17\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:22:19\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:26:43\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-23 19:31:12\"}]', '2026-01-23 18:32:55', '2026-01-23 19:31:12', '2026-01-23 18:32:55'),
(6, '103.221.247.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/projects\", \"visited_at\": \"2026-01-23 18:49:38\"}]', '2026-01-23 18:49:38', '2026-01-23 18:49:38', '2026-01-23 18:49:38'),
(7, '58.27.225.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/reviews\", \"visited_at\": \"2026-01-23 18:57:17\"}]', '2026-01-23 18:57:17', '2026-01-23 18:57:17', '2026-01-23 18:57:17'),
(8, '2001:bc8:701:51:da5e:d3ff:feea:f6ad', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.3', 'Chrome', 'Linux', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-24 16:05:16\"}]', '2026-01-24 16:05:16', '2026-01-24 16:05:16', '2026-01-24 16:05:16'),
(9, '110.38.242.146', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-24 18:05:31\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-24 18:35:39\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-24 18:35:43\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-24 18:35:52\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-24 18:36:00\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-24 18:36:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 19:18:23\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-24 19:18:24\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-24 19:18:30\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-24 19:18:59\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-24 19:19:01\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-24 19:19:02\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 19:19:11\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-24 19:21:17\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 19:33:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 19:34:35\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-24 20:26:49\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:23:17\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:23:27\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:42:17\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:43:48\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:44:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:46:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 07:46:12\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:00:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:00:30\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:22:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:22:59\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:25:48\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:29:28\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:37:13\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:38:34\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:48:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:20:02\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:20:09\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:20:48\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:20:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:21:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:37:33\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 12:37:42\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-26 12:37:46\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 12:37:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:37:48\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:47:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:48:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:49:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:49:30\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:49:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:49:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:50:13\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:50:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 12:50:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:03:06\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:03:09\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:03:12\"}]', '2026-01-24 18:05:31', '2026-01-26 13:03:12', '2026-01-24 18:05:31'),
(10, '149.57.180.57', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 'Chrome', 'macOS', 'desktop', NULL, 'United States', 'New York City', '[{\"page\": \"/\", \"visited_at\": \"2026-01-24 19:05:34\"}]', '2026-01-24 19:05:34', '2026-01-24 19:05:34', '2026-01-24 19:05:34'),
(11, '66.56.82.17', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Linux', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 01:04:48\"}]', '2026-01-25 01:04:48', '2026-01-25 01:04:48', '2026-01-25 01:04:48'),
(12, '18.204.226.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 07:47:10\"}]', '2026-01-25 07:47:10', '2026-01-25 07:47:10', '2026-01-25 07:47:10'),
(13, '100.53.51.204', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 07:48:07\"}]', '2026-01-25 07:48:07', '2026-01-25 07:48:07', '2026-01-25 07:48:07'),
(14, '54.226.203.152', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 07:50:10\"}]', '2026-01-25 07:50:10', '2026-01-25 07:50:10', '2026-01-25 07:50:10'),
(15, '18.232.103.190', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 07:51:08\"}]', '2026-01-25 07:51:08', '2026-01-25 07:51:08', '2026-01-25 07:51:08'),
(16, '44.211.88.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 08:11:22\"}]', '2026-01-25 08:11:22', '2026-01-25 08:11:22', '2026-01-25 08:11:22'),
(17, '44.222.158.23', 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 'WebKit', 'iOS', 'mobile', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 08:11:36\"}]', '2026-01-25 08:11:36', '2026-01-25 08:11:36', '2026-01-25 08:11:36'),
(18, '2404:3100:147c:d52:409b:c9ff:fedc:59dc', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 12:30:01\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 12:30:28\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-25 12:30:34\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-25 12:30:44\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-25 12:30:47\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-25 12:32:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:32:06\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 17:57:51\"}]', '2026-01-25 12:30:01', '2026-01-25 17:57:51', '2026-01-25 12:30:01'),
(19, '110.38.242.146', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 12:34:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:34:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:19:32\"}]', '2026-01-25 12:34:19', '2026-01-26 10:19:32', '2026-01-25 12:34:19'),
(20, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', 'http://localhost:5173/', 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 12:54:33\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 12:55:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:03:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:06:29\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 13:07:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 14:54:13\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 06:46:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 06:46:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 06:47:26\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 07:08:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:32:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:42:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:43:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 09:43:35\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 10:15:35\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:06:04\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:07:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:07:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:54:09\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:54:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:55:00\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 14:13:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 14:39:16\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:39:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:39:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:42:35\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:44:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:46:20\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:33:03\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 07:51:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:06:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:06:38\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:06:39\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 08:42:01\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:23:05\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:27:50\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:07:01\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:07:58\"}]', '2026-01-25 12:54:33', '2026-02-01 14:07:58', '2026-01-25 12:54:33'),
(21, '182.190.217.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 18:00:19\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-25 18:00:26\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 18:02:10\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-25 18:02:23\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 18:02:24\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-25 18:02:26\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-25 18:02:26\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-25 18:02:27\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-25 18:02:30\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-25 18:02:36\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-25 18:02:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-25 18:02:54\"}]', '2026-01-25 18:00:19', '2026-01-25 18:02:54', '2026-01-25 18:00:19'),
(22, '54.244.181.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0', 'Firefox', 'Windows', 'desktop', NULL, 'United States', 'Boardman', '[{\"page\": \"/\", \"visited_at\": \"2026-01-25 19:58:33\"}]', '2026-01-25 19:58:33', '2026-01-25 19:58:33', '2026-01-25 19:58:33'),
(23, '204.101.161.15', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Linux', 'desktop', NULL, 'Canada', 'Burnaby', '[{\"page\": \"/\", \"visited_at\": \"2026-01-26 00:04:56\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 23:11:02\"}]', '2026-01-26 00:04:56', '2026-01-29 23:11:02', '2026-01-26 00:04:56'),
(24, '52.43.201.114', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0', 'Firefox', 'Windows', 'desktop', NULL, 'United States', 'Boardman', '[{\"page\": \"/\", \"visited_at\": \"2026-01-26 10:12:22\"}]', '2026-01-26 10:12:22', '2026-01-26 10:12:22', '2026-01-26 10:12:22'),
(25, '223.123.48.114', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Islamabad', '[{\"page\": \"/\", \"visited_at\": \"2026-01-26 10:59:34\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 10:59:53\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 10:59:58\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-26 11:00:16\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 11:00:19\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-26 11:00:22\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 11:00:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 11:00:29\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 11:00:50\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 11:01:10\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 11:01:15\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-01-26 11:01:25\"}]', '2026-01-26 10:59:34', '2026-01-26 11:01:25', '2026-01-26 10:59:34'),
(26, '110.38.242.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-26 13:39:31\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 13:39:34\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-26 13:39:35\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 13:39:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:39:37\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 13:43:20\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-26 13:43:30\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-26 13:43:34\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-26 13:43:35\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-26 13:43:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:43:37\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-26 13:46:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-27 13:47:15\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-27 13:47:25\"}, {\"page\": \"/services\", \"visited_at\": \"2026-01-27 13:47:27\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-27 13:47:29\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-01-27 13:47:29\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-27 13:47:32\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-27 13:48:34\"}, {\"page\": \"/about\", \"visited_at\": \"2026-01-27 13:48:39\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-27 13:48:40\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-27 13:48:58\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-27 13:49:03\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-27 13:49:05\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-01-27 13:49:22\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-27 13:49:25\"}]', '2026-01-26 13:39:31', '2026-01-27 13:49:25', '2026-01-26 13:39:31'),
(27, '54.38.152.16', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Linux', 'desktop', NULL, 'Germany', 'Limburg an der Lahn', '[{\"page\": \"/\", \"visited_at\": \"2026-01-27 02:56:00\"}]', '2026-01-27 02:56:00', '2026-01-27 02:56:00', '2026-01-27 02:56:00'),
(28, '51.83.243.160', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Linux', 'desktop', NULL, 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-01-28 01:44:02\"}]', '2026-01-28 01:44:02', '2026-01-28 01:44:02', '2026-01-28 01:44:02'),
(29, '151.240.205.206', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Linux', 'desktop', NULL, 'United States', 'New York City', '[{\"page\": \"/\", \"visited_at\": \"2026-01-28 23:06:46\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 22:14:44\"}]', '2026-01-28 23:06:46', '2026-01-30 22:14:44', '2026-01-28 23:06:46'),
(30, '2001:bc8:1da0:1e:da5e:d3ff:fe6f:cbe5', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.3', 'Chrome', 'Linux', 'desktop', NULL, 'Poland', 'Warsaw', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 02:53:02\"}]', '2026-01-29 02:53:02', '2026-01-29 02:53:02', '2026-01-29 02:53:02'),
(31, '34.83.203.92', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'Chrome', 'macOS', 'desktop', NULL, 'United States', 'The Dalles', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 08:30:53\"}]', '2026-01-29 08:30:53', '2026-01-29 08:30:53', '2026-01-29 08:30:53'),
(32, '104.28.163.61', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Flower Mound', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 08:30:58\"}]', '2026-01-29 08:30:58', '2026-01-29 08:30:58', '2026-01-29 08:30:58'),
(33, '103.74.22.127', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 13:48:33\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 17:04:38\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 07:12:15\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 07:19:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 07:20:35\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 08:37:18\"}]', '2026-01-29 13:48:33', '2026-01-31 08:37:18', '2026-01-29 13:48:33'),
(34, '157.20.147.52', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Lahore', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 13:48:38\"}]', '2026-01-29 13:48:38', '2026-01-29 13:48:38', '2026-01-29 13:48:38'),
(35, '119.160.2.245', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 13:49:12\"}]', '2026-01-29 13:49:12', '2026-01-29 13:49:12', '2026-01-29 13:49:12'),
(36, '2600:3c06::f03c:95ff:feea:809f', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Chicago', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 14:17:57\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-29 14:21:16\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-06 14:17:59\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-06 14:20:24\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-19 14:17:58\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-19 14:20:22\"}]', '2026-01-29 14:17:57', '2026-02-19 14:20:22', '2026-01-29 14:17:57'),
(37, '98.87.154.44', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'Chrome', 'Linux', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-01-29 17:43:49\"}]', '2026-01-29 17:43:49', '2026-01-29 17:43:49', '2026-01-29 17:43:49'),
(38, '2a09:bac1:27c0:1328::400:64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'France', 'Montlucon', '[{\"page\": \"/\", \"visited_at\": \"2026-01-30 09:02:37\"}]', '2026-01-30 09:02:37', '2026-01-30 09:02:37', '2026-01-30 09:02:37'),
(39, '39.50.215.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Hyderabad', '[{\"page\": \"/\", \"visited_at\": \"2026-01-30 13:27:52\"}]', '2026-01-30 13:27:52', '2026-01-30 13:27:52', '2026-01-30 13:27:52'),
(40, '39.50.215.40', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Hyderabad', '[{\"page\": \"/\", \"visited_at\": \"2026-01-30 13:28:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 13:29:30\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 13:30:16\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 13:30:20\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 13:32:25\"}]', '2026-01-30 13:28:11', '2026-01-30 13:32:25', '2026-01-30 13:28:11'),
(41, '103.74.22.127', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-30 15:58:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 07:20:59\"}]', '2026-01-30 15:58:36', '2026-01-31 07:20:59', '2026-01-30 15:58:36'),
(42, '154.91.161.250', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-30 16:02:18\"}]', '2026-01-30 16:02:18', '2026-01-30 16:02:18', '2026-01-30 16:02:18'),
(43, '154.91.161.250', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-30 16:04:30\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 16:06:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-30 16:09:10\"}]', '2026-01-30 16:04:30', '2026-01-30 16:09:10', '2026-01-30 16:04:30'),
(44, '110.38.242.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-01-31 19:14:51\"}, {\"page\": \"/\", \"visited_at\": \"2026-01-31 19:18:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:08:01\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 06:53:55\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 08:20:38\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 12:28:10\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 12:36:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 12:38:58\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 12:39:40\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-04 14:00:04\"}]', '2026-01-31 19:14:51', '2026-02-04 14:00:04', '2026-01-31 19:14:51'),
(45, '2404:3100:1460:bc5b:4927:455c:a4fa:da3b', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 12:33:14\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:36:19\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:38:14\"}]', '2026-02-01 12:33:14', '2026-02-01 12:38:14', '2026-02-01 12:33:14'),
(46, '2404:3100:1460:bc5b:4927:455c:a4fa:da3b', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 12:34:05\"}]', '2026-02-01 12:34:05', '2026-02-01 12:34:05', '2026-02-01 12:34:05'),
(47, '2a02:4780:5c:1234::4c', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse', 'Chrome', 'macOS', 'desktop', NULL, 'Malaysia', 'Kuala Lumpur', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 12:36:12\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 12:59:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-13 05:47:34\"}]', '2026-02-01 12:36:12', '2026-02-13 05:47:34', '2026-02-01 12:36:12'),
(48, '2404:3100:1460:bc5b:996e:a884:fc83:df13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 12:57:29\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:24:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:35:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:59:04\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-01 13:59:12\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-01 13:59:14\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-02-01 13:59:16\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:00:11\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 14:01:02\"}]', '2026-02-01 12:57:29', '2026-02-01 14:01:02', '2026-02-01 12:57:29'),
(49, '2404:3100:1460:bc5b:d8b8:dfff:fe2d:6dc9', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 13:24:18\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:24:29\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:26:41\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-01 13:26:57\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:27:00\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-01 13:27:02\"}, {\"page\": \"/services\", \"visited_at\": \"2026-02-01 13:27:06\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-01 13:27:15\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-02-01 13:27:18\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:27:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:32:01\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:32:28\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-01 13:35:39\"}]', '2026-02-01 13:24:18', '2026-02-01 13:35:39', '2026-02-01 13:24:18'),
(50, '2404:3100:1460:bc5b:996e:a884:fc83:df13', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 13:24:55\"}]', '2026-02-01 13:24:55', '2026-02-01 13:24:55', '2026-02-01 13:24:55'),
(51, '2a02:4780:5c:1234::4c', 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Malaysia', 'Kuala Lumpur', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 13:28:42\"}]', '2026-02-01 13:28:42', '2026-02-01 13:28:42', '2026-02-01 13:28:42'),
(52, '58.27.225.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Lahore', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 13:59:26\"}]', '2026-02-01 13:59:26', '2026-02-01 13:59:26', '2026-02-01 13:59:26'),
(53, '157.20.147.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Lahore', '[{\"page\": \"/\", \"visited_at\": \"2026-02-01 14:00:07\"}]', '2026-02-01 14:00:07', '2026-02-01 14:00:07', '2026-02-01 14:00:07'),
(54, '2404:3100:1458:90e5:2821:c2ff:fe09:c35e', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-02 07:07:16\"}]', '2026-02-02 07:07:16', '2026-02-02 07:07:16', '2026-02-02 07:07:16'),
(55, '17.246.19.34', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)', 'Safari', 'macOS', 'desktop', NULL, 'United States', 'Cupertino', '[{\"page\": \"/contact\", \"visited_at\": \"2026-02-10 04:54:53\"}]', '2026-02-10 04:54:53', '2026-02-10 04:54:53', '2026-02-10 04:54:53'),
(56, '110.38.242.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-13 05:45:03\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-13 05:49:49\"}, {\"page\": \"/services\", \"visited_at\": \"2026-02-13 05:49:53\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-13 05:50:15\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-02-13 05:50:26\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-13 05:50:29\"}]', '2026-02-13 05:45:03', '2026-02-13 05:50:29', '2026-02-13 05:45:03');
INSERT INTO `visitors` (`id`, `ip_address`, `user_agent`, `browser`, `os`, `device_type`, `referrer`, `country`, `city`, `pages_visited`, `first_visit_at`, `last_visit_at`, `createdAt`) VALUES
(57, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', 'http://localhost:5173/', 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-02-14 11:59:45\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:11:06\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:14:41\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:16:01\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-14 12:23:18\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:23:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:23:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:29:52\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:36:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:37:54\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:38:03\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 12:46:31\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:46:31\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 12:46:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:53:38\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 12:54:34\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 12:57:02\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 13:00:39\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 13:01:26\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 13:01:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 13:03:28\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 13:03:32\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 13:03:50\"}, {\"page\": \"/services\", \"visited_at\": \"2026-02-14 13:21:33\"}]', '2026-02-14 11:59:45', '2026-02-14 13:21:33', '2026-02-14 11:59:45'),
(58, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', 'http://localhost:5173/', 'Unknown', 'Unknown', '[{\"page\": \"/\", \"visited_at\": \"2026-02-14 12:25:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:25:47\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-14 12:34:06\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-14 13:04:07\"}]', '2026-02-14 12:25:07', '2026-02-14 13:04:07', '2026-02-14 12:25:07'),
(59, '103.74.22.62', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-15 08:26:51\"}]', '2026-02-15 08:26:51', '2026-02-15 08:26:51', '2026-02-15 08:26:51'),
(60, '110.38.242.77', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-17 13:56:25\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-17 13:58:08\"}]', '2026-02-17 13:56:25', '2026-02-17 13:58:08', '2026-02-17 13:56:25'),
(61, '17.22.245.179', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)', 'Safari', 'macOS', 'desktop', NULL, 'United States', 'Cupertino', '[{\"page\": \"/about\", \"visited_at\": \"2026-02-18 07:01:53\"}]', '2026-02-18 07:01:53', '2026-02-18 07:01:53', '2026-02-18 07:01:53'),
(62, '110.38.248.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-18 15:12:22\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-18 15:12:38\"}, {\"page\": \"/services\", \"visited_at\": \"2026-02-18 15:12:42\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-18 15:12:45\"}, {\"page\": \"/reviews\", \"visited_at\": \"2026-02-18 15:12:47\"}, {\"page\": \"/services\", \"visited_at\": \"2026-02-18 15:18:02\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-18 15:18:03\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-18 15:18:04\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-18 15:18:07\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-18 15:18:10\"}, {\"page\": \"/projects\", \"visited_at\": \"2026-02-18 15:18:16\"}, {\"page\": \"/contact\", \"visited_at\": \"2026-02-18 15:18:24\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-20 05:50:44\"}]', '2026-02-18 15:12:22', '2026-02-20 05:50:44', '2026-02-18 15:12:22'),
(63, '110.38.248.73', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-19 18:19:35\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-19 18:25:42\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-19 18:27:11\"}]', '2026-02-19 18:19:35', '2026-02-19 18:27:11', '2026-02-19 18:19:35'),
(64, '154.91.163.194', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-19 18:23:35\"}]', '2026-02-19 18:23:35', '2026-02-19 18:23:35', '2026-02-19 18:23:35'),
(65, '23.27.145.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'San Jose', '[{\"page\": \"/\", \"visited_at\": \"2026-02-22 19:06:50\"}]', '2026-02-22 19:06:50', '2026-02-22 19:06:50', '2026-02-22 19:06:50'),
(66, '23.95.244.38', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'United States', 'Buffalo', '[{\"page\": \"/\", \"visited_at\": \"2026-02-24 02:07:27\"}]', '2026-02-24 02:07:27', '2026-02-24 02:07:27', '2026-02-24 02:07:27'),
(67, '44.227.127.2', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36', 'Chrome Headless', 'Linux', 'desktop', NULL, 'United States', 'Boardman', '[{\"page\": \"/\", \"visited_at\": \"2026-02-24 20:22:58\"}]', '2026-02-24 20:22:58', '2026-02-24 20:22:58', '2026-02-24 20:22:58'),
(68, '154.198.123.248', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-25 05:15:29\"}]', '2026-02-25 05:15:29', '2026-02-25 05:15:29', '2026-02-25 05:15:29'),
(69, '2404:3100:1459:a18:7449:a5ff:fe5f:d8bd', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'Mobile Chrome', 'Android', 'mobile', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-25 13:41:24\"}]', '2026-02-25 13:41:24', '2026-02-25 13:41:24', '2026-02-25 13:41:24'),
(70, '100.55.74.246', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 Edg/101.0.1210.39', 'Edge', 'Linux', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-02-26 02:41:58\"}]', '2026-02-26 02:41:58', '2026-02-26 02:41:58', '2026-02-26 02:41:58'),
(71, '17.246.19.28', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)', 'Safari', 'macOS', 'desktop', NULL, 'United States', 'Cupertino', '[{\"page\": \"/projects\", \"visited_at\": \"2026-02-27 08:10:49\"}]', '2026-02-27 08:10:49', '2026-02-27 08:10:49', '2026-02-27 08:10:49'),
(72, '17.22.237.75', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)', 'Safari', 'macOS', 'desktop', NULL, 'United States', 'Cupertino', '[{\"page\": \"/contact\", \"visited_at\": \"2026-02-27 08:28:23\"}]', '2026-02-27 08:28:23', '2026-02-27 08:28:23', '2026-02-27 08:28:23'),
(73, '54.234.30.235', 'Opera/7.50 (Windows ME; U) [en]', 'Opera', 'Windows', 'desktop', NULL, 'United States', 'Ashburn', '[{\"page\": \"/\", \"visited_at\": \"2026-02-27 15:46:08\"}]', '2026-02-27 15:46:08', '2026-02-27 15:46:08', '2026-02-27 15:46:08'),
(74, '110.38.248.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'Chrome', 'Windows', 'desktop', NULL, 'Pakistan', 'Karachi', '[{\"page\": \"/\", \"visited_at\": \"2026-02-28 19:19:27\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-28 19:19:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-02-28 19:19:38\"}, {\"page\": \"/services\", \"visited_at\": \"2026-02-28 19:19:40\"}, {\"page\": \"/about\", \"visited_at\": \"2026-02-28 19:19:43\"}, {\"page\": \"/\", \"visited_at\": \"2026-03-01 11:44:36\"}, {\"page\": \"/\", \"visited_at\": \"2026-03-01 12:26:15\"}]', '2026-02-28 19:19:27', '2026-03-01 12:26:15', '2026-02-28 19:19:27'),
(75, '17.241.75.18', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)', 'Safari', 'macOS', 'desktop', NULL, 'United States', 'Cupertino', '[{\"page\": \"/reviews\", \"visited_at\": \"2026-02-28 23:00:22\"}]', '2026-02-28 23:00:22', '2026-02-28 23:00:22', '2026-02-28 23:00:22');

-- --------------------------------------------------------

--
-- Table structure for table `work_experience`
--

CREATE TABLE `work_experience` (
  `id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `employmentType` varchar(100) DEFAULT 'Full-time',
  `startedAt` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `currentlyWorking` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `technologies` text DEFAULT NULL,
  `companyLogo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`companyLogo`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `work_experience`
--

INSERT INTO `work_experience` (`id`, `position`, `company`, `employmentType`, `startedAt`, `endDate`, `currentlyWorking`, `description`, `technologies`, `companyLogo`, `createdAt`, `updatedAt`) VALUES
(4, 'Full Stack Developer', 'QuantumForge Tech', 'Part-time', '2025-10-01', '2025-11-15', 0, 'Built and maintained full-stack web applications using the MERN stack for client projects.  \r\nDesigned RESTful APIs with Node.js and Express, connected to MongoDB databases for efficient data management.  \r\nDeveloped dynamic and responsive frontends using React.js and TailwindCSS, following component-based architecture.  \r\nImplemented state management using Redux to ensure seamless user interactions.  \r\nOptimized application performance and code quality through refactoring and best practices.  \r\nCollaborated with clients to define project requirements and deliver production-ready solutions on time.', 'MongoDB, Express.js, React.js, Node.js, TailwindCSS, Redux, Git, Docker', 'null', '2026-01-23 19:31:05', '2026-01-23 19:31:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `siteInfoId` (`siteInfoId`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recent_activities`
--
ALTER TABLE `recent_activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seo_pages`
--
ALTER TABLE `seo_pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `siteInfoId` (`siteInfoId`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_info`
--
ALTER TABLE `site_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_experience`
--
ALTER TABLE `work_experience`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about`
--
ALTER TABLE `about`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recent_activities`
--
ALTER TABLE `recent_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `seo_pages`
--
ALTER TABLE `seo_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_info`
--
ALTER TABLE `site_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `work_experience`
--
ALTER TABLE `work_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD CONSTRAINT `contact_info_ibfk_1` FOREIGN KEY (`siteInfoId`) REFERENCES `site_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seo_pages`
--
ALTER TABLE `seo_pages`
  ADD CONSTRAINT `seo_pages_ibfk_1` FOREIGN KEY (`siteInfoId`) REFERENCES `site_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
