-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2025 at 01:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oracle_language_centre`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `password`) VALUES
(1, 'admin', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `fee` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `duration`, `fee`, `description`) VALUES
(1, 'Kikuyu Language', '3 months', 5000, 'Learn to speak and write Kikuyu fluently.'),
(2, 'Swahili Language', '4 months', 6000, 'Comprehensive Swahili course for beginners.'),
(3, 'Arabic Language', '6 months', 8000, 'Master Arabic with our expert trainers.'),
(4, 'Gikuyu Classes', '3 months', 5000, 'Our Gikuyu language lessons target both children and adults, Kenyan or foreigners designed for all, from beginners to advanced learners.'),
(5, 'Luhya Classes', '3 months', 5000, 'It doesn\'t matter the Luhya sub-language you want to learn, we\'ve got native speaking tutors who will help exceed your goals.'),
(6, 'Kalenjin Classes', '3 months', 5000, 'Interested in learning Kalenjin? We offer Kalenjin classes in Nairobi Kenya physically or online for either group or private students.'),
(7, 'Luo Classes', '3 months', 5000, 'Whether you want to improve your Luo language skills or start learning for the first time, join our Luo classes today.'),
(8, 'Kamba Classes', '3 months', 5000, 'You will learn how to communicate in Kamba in a variety of daily situations, taught by our native Kamba teachers.'),
(9, 'Swahili Classes', '4 months', 6000, 'Highly personalised and designed course to improve your Swahili language and communication skills.'),
(10, 'Arabic Classes', '6 months', 8000, 'Learn Arabic online or at our school. Courses for all levels, beginners to advanced. Evening and weekend classes available.'),
(11, 'English Classes', '4 months', 7000, 'Our course will help improve your English language skills which are essential for travel, work purposes or simply for personal interest.'),
(12, 'French Classes', '5 months', 7500, 'We guide you all the way from beginner to fluent. Teaching people from all walks of life and all nationalities.'),
(13, 'Spanish Classes', '5 months', 7500, 'Want to study Spanish? Start private Spanish lessons, group Spanish lessons or online Spanish lessons.'),
(14, 'Chinese Classes', '6 months', 8500, 'Learn and study with us. We provide beginner to advanced level Chinese language lessons.');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `tutor_id` int(11) DEFAULT NULL,
  `librarian_id` int(11) DEFAULT NULL,
  `finance_manager_id` int(11) DEFAULT NULL,
  `hod_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','resolved') DEFAULT 'pending',
  `reply` text DEFAULT NULL,
  `reply_by` varchar(255) DEFAULT NULL,
  `reply_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `student_id`, `tutor_id`, `librarian_id`, `finance_manager_id`, `hod_id`, `message`, `rating`, `created_at`, `status`, `reply`, `reply_by`, `reply_time`) VALUES
(1, 2, 2, NULL, NULL, NULL, 'Great support and assistance.', 5, '2025-04-14 10:23:09', 'pending', NULL, NULL, NULL),
(2, 3, 1, NULL, NULL, NULL, 'Hey Mary', NULL, '2025-04-14 15:45:44', 'pending', NULL, NULL, NULL),
(3, 3, 1, NULL, NULL, NULL, 'Hey Kerren', NULL, '2025-04-14 15:46:49', 'pending', NULL, NULL, NULL),
(4, 3, 1, NULL, NULL, NULL, 'Hey Dennis', 2, '2025-04-14 15:48:10', 'pending', NULL, NULL, NULL),
(5, 3, 3, NULL, NULL, NULL, 'Hey Den,\r\nI have an issue with my portal.\r\nCan you help me fix it?', 1, '2025-04-14 16:21:24', 'resolved', 'I got you bro', 'Denis', '2025-04-15 08:36:38'),
(6, 2, 1, NULL, NULL, NULL, 'Hey Kerren Maiko it is finance Alex.', 5, '2025-04-14 16:52:12', 'resolved', 'Okey ..done doend', 'Mary', '2025-04-15 09:04:16'),
(7, 2, 1, NULL, NULL, NULL, 'Hey Kariyki ', 1, '2025-04-14 17:00:22', 'pending', NULL, NULL, NULL),
(8, 2, NULL, NULL, NULL, 1, 'Hey keeeeerrr', 1, '2025-04-14 17:12:45', 'resolved', 'Okey Alloys', 'Kerren', '2025-04-15 11:05:48'),
(9, 2, NULL, NULL, 1, NULL, 'Hey Pettttt', 1, '2025-04-14 17:13:33', 'resolved', 'Thanks', 'my name', '2025-04-15 07:12:23'),
(10, 2, NULL, 1, NULL, NULL, 'Hey librarian ', 4, '2025-04-14 17:26:14', 'resolved', 'WELCOME', NULL, NULL),
(11, 2, NULL, NULL, 1, NULL, 'Th', 2, '2025-04-14 17:35:44', 'resolved', 'Okey brother', 'Peter Kariuki', '2025-04-15 07:30:34'),
(12, 2, NULL, NULL, 1, NULL, 'A', 4, '2025-04-15 10:11:14', 'pending', NULL, NULL, NULL),
(13, 2, NULL, NULL, 1, NULL, '\nI appreciate for the approval of fee.\n', 5, '2025-04-15 10:25:27', 'resolved', 'You\'re welcome,pay your balance!', 'Peter Kariuki', '2025-04-15 10:26:45'),
(14, 2, 2, NULL, NULL, NULL, 'Appreciate your teachings.', 2, '2025-04-15 10:26:01', 'resolved', 'Welcome and attend Classes!!', 'Mark', '2025-04-15 10:27:17'),
(15, 3, NULL, 1, NULL, NULL, 'The resources were helpful!', 3, '2025-04-15 10:50:52', 'resolved', 'Okey great', 'Lanoi', '2025-04-15 10:51:39');

-- --------------------------------------------------------

--
-- Table structure for table `finance_managers`
--

CREATE TABLE `finance_managers` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finance_managers`
--

INSERT INTO `finance_managers` (`id`, `username`, `firstname`, `lastname`, `email`, `phone`, `password`) VALUES
(1, 'Peter', 'Peter', 'Kariuki', 'peterkariuki@gmail.com', '0712345678', '$2b$10$USs3YXoU/4c/pxi.Ol2XxuKRPyxLeBDP/Sx68RQdcoIdw.B5rquFS');

-- --------------------------------------------------------

--
-- Table structure for table `hods`
--

CREATE TABLE `hods` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hods`
--

INSERT INTO `hods` (`id`, `username`, `firstname`, `lastname`, `email`, `phone`, `password`) VALUES
(1, 'Kerren', 'Kerren', 'Maiko', 'kerrenmaiko@gmail.com', '0710560670', '$2b$10$44eZM1ZtWq22crvOpwlPn.PTMq4P9kHoh4haFfG4Q2daPEUrrawp6');

-- --------------------------------------------------------

--
-- Table structure for table `learning_resources`
--

CREATE TABLE `learning_resources` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `resource_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `learning_resources`
--

INSERT INTO `learning_resources` (`id`, `course_id`, `resource_name`, `created_at`) VALUES
(1, 1, 'Kikuyu Beginner Guide (PDF)', '2025-03-25 10:43:19'),
(2, 1, 'Kikuyu Audio Lessons (MP3)', '2025-03-25 10:43:19'),
(3, 1, 'Kikuyu Grammar Workbook', '2025-03-25 10:43:19'),
(4, 2, 'Swahili Basics eBook', '2025-03-25 10:43:19'),
(5, 2, 'Swahili Pronunciation Guide (Audio)', '2025-03-25 10:43:19'),
(6, 2, 'Swahili Conversations (Video)', '2025-03-25 10:43:19'),
(7, 3, 'Arabic Alphabets Chart', '2025-03-25 10:43:19'),
(8, 3, 'Arabic Writing Workbook', '2025-03-25 10:43:19'),
(9, 3, 'Basic Arabic Phrases (MP3)', '2025-03-25 10:43:19'),
(10, 4, 'Gikuyu Vocabulary Flashcards', '2025-03-25 10:43:19'),
(11, 4, 'Gikuyu Cultural Expressions', '2025-03-25 10:43:19'),
(12, 4, 'Gikuyu Phonetics Audio', '2025-03-25 10:43:19'),
(13, 5, 'Luhya Language Guide', '2025-03-25 10:43:19'),
(14, 5, 'Luhya Conversational Phrases', '2025-03-25 10:43:19'),
(15, 5, 'Luhya Songs for Learning', '2025-03-25 10:43:19'),
(16, 6, 'Kalenjin Language Essentials', '2025-03-25 10:43:19'),
(17, 6, 'Kalenjin Speech Training', '2025-03-25 10:43:19'),
(18, 6, 'Kalenjin Audio Lessons', '2025-03-25 10:43:19'),
(19, 7, 'Luo Language Starter Kit', '2025-03-25 10:43:19'),
(20, 7, 'Luo Folktales & Stories', '2025-03-25 10:43:19'),
(21, 7, 'Luo Grammar Reference', '2025-03-25 10:43:19'),
(22, 8, 'Kamba Vocabulary List', '2025-03-25 10:43:19'),
(23, 8, 'Kamba Dialogues (MP3)', '2025-03-25 10:43:19'),
(24, 8, 'Kamba Sentence Structure Guide', '2025-03-25 10:43:19'),
(25, 9, 'Swahili Interactive Course', '2025-03-25 10:43:19'),
(26, 9, 'Swahili Reading Practice', '2025-03-25 10:43:19'),
(27, 9, 'Swahili Songs & Poems', '2025-03-25 10:43:19'),
(28, 10, 'Arabic Online Course Materials', '2025-03-25 10:43:19'),
(29, 10, 'Arabic Writing & Calligraphy', '2025-03-25 10:43:19'),
(30, 10, 'Arabic Religious Texts (PDF)', '2025-03-25 10:43:19'),
(31, 11, 'English Grammar Exercises', '2025-03-25 10:43:19'),
(32, 11, 'English Listening Practice', '2025-03-25 10:43:19'),
(33, 11, 'English Writing Guide', '2025-03-25 10:43:19'),
(34, 12, 'French Language eBook', '2025-03-25 10:43:19'),
(35, 12, 'French Pronunciation Practice', '2025-03-25 10:43:19'),
(36, 12, 'French Short Stories (MP3)', '2025-03-25 10:43:19'),
(37, 13, 'Spanish Beginner’s Handbook', '2025-03-25 10:43:19'),
(38, 13, 'Spanish Interactive Workbook', '2025-03-25 10:43:19'),
(39, 13, 'Spanish Conversations & Phrases', '2025-03-25 10:43:19'),
(40, 14, 'Chinese Pinyin Guide', '2025-03-25 10:43:19'),
(41, 14, 'Chinese Characters Workbook', '2025-03-25 10:43:19'),
(42, 14, 'Chinese Audio Lessons', '2025-03-25 10:43:19');

-- --------------------------------------------------------

--
-- Table structure for table `librarians`
--

CREATE TABLE `librarians` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `librarians`
--

INSERT INTO `librarians` (`id`, `username`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'Lanoi', 'Derrick', 'Lanoi', 'derricklanoi@gmail.com', '$2b$10$9JysdLh35QjSKAOIInuhwub1NnXmrdb9zFhQTc8dnqOh/ySXm5viy');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `payment_method` enum('mpesa','bank') NOT NULL,
  `reference_code` varchar(14) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `id_number` varchar(20) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount_paid` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `student_id`, `course_id`, `payment_method`, `reference_code`, `location`, `birth_year`, `id_number`, `status`, `created_at`, `amount_paid`) VALUES
(17, 11, 4, 'mpesa', 'QWERTE231T', 'Nairobi ', 2002, '40217945', 'approved', '2025-03-28 13:40:40', 2500.00),
(18, 11, 4, 'mpesa', 'QWEKTRDES1', NULL, NULL, NULL, 'approved', '2025-03-28 14:29:11', 2500.00),
(19, 3, 1, 'mpesa', 'QWERT45ERD', 'Nairobi ', 2002, '40217945', 'approved', '2025-03-29 11:38:54', 2500.00),
(20, 3, 1, 'mpesa', 'QWER43FTR4', NULL, NULL, NULL, 'approved', '2025-03-29 11:51:09', 2500.00);

-- --------------------------------------------------------

--
-- Table structure for table `resource_requests`
--

CREATE TABLE `resource_requests` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `librarian_submitted` tinyint(1) DEFAULT 0,
  `student_confirmed` tinyint(1) DEFAULT 0,
  `resource_id` int(11) NOT NULL,
  `status` enum('requested','submitted') NOT NULL DEFAULT 'requested'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_requests`
--

INSERT INTO `resource_requests` (`id`, `student_id`, `course_id`, `requested_at`, `librarian_submitted`, `student_confirmed`, `resource_id`, `status`) VALUES
(39, 11, 4, '2025-03-28 13:49:35', 1, 1, 10, 'submitted'),
(40, 3, 1, '2025-03-29 11:43:37', 1, 1, 2, 'submitted');

-- --------------------------------------------------------

--
-- Table structure for table `storekeepers`
--

CREATE TABLE `storekeepers` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storekeepers`
--

INSERT INTO `storekeepers` (`id`, `username`, `first_name`, `last_name`, `email`, `phone`, `password`) VALUES
(1, 'Kelvin', 'Kelvin', 'Kang\'ethe', 'kelvin.kangethe@gmail.com', '0796543281', '$2b$10$Cp2R3lGQGcLMDRjwfEMOquOFNGdLpB2bD1nLmeyAQb2P90BwNOLeG');

-- --------------------------------------------------------

--
-- Table structure for table `store_items`
--

CREATE TABLE `store_items` (
  `id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cost` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_items`
--

INSERT INTO `store_items` (`id`, `category`, `item_name`, `quantity`, `description`, `created_at`, `cost`) VALUES
(1, 'Learning Materials', 'Textbooks (Swahili Grammar, Arabic Guide)', 50, 'Language textbooks for students', '2025-03-30 06:48:33', 1500.00),
(2, 'Learning Materials', 'Workbooks & Exercise Books', 63, 'Practice workbooks for language learners', '2025-03-30 06:48:33', 800.00),
(3, 'Learning Materials', 'Language Flashcards', 60, 'Flashcards for vocabulary learning', '2025-03-30 06:48:33', 1200.00),
(4, 'Learning Materials', 'Digital Learning Resources (USBs with lessons)', 30, 'USBs with recorded lessons and digital content', '2025-03-30 06:48:33', 2500.00),
(5, 'Audio-Visual Aids', 'Headphones & Earphones', 30, 'Used for listening to language recordings', '2025-03-30 06:48:33', 3000.00),
(6, 'Audio-Visual Aids', 'Microphones', 15, 'For pronunciation practice and recording lessons', '2025-03-30 06:48:33', 4500.00),
(7, 'Audio-Visual Aids', 'Speakers', 20, 'Used in classrooms for audio lessons', '2025-03-30 06:48:33', 7000.00),
(8, 'Audio-Visual Aids', 'Projectors & Screens', 5, 'For displaying video lessons and presentations', '2025-03-30 06:48:33', 25000.00),
(9, 'IT & Digital Equipment', 'Computers & Laptops', 10, 'Used by students and instructors for research', '2025-03-30 06:48:33', 60000.00),
(10, 'IT & Digital Equipment', 'Tablets', 8, 'For interactive language learning', '2025-03-30 06:48:33', 35000.00),
(11, 'IT & Digital Equipment', 'Printers & Scanners', 3, 'For printing and scanning documents', '2025-03-30 06:48:33', 15000.00),
(12, 'IT & Digital Equipment', 'External Hard Drives & USBs', 15, 'For storing learning materials', '2025-03-30 06:48:33', 5000.00),
(13, 'Classroom Supplies', 'Whiteboards & Markers', 12, 'For writing lessons and explanations', '2025-03-30 06:48:33', 4000.00),
(14, 'Classroom Supplies', 'Chalk & Chalkboards', 10, 'For traditional classroom learning', '2025-03-30 06:48:33', 2000.00),
(15, 'Classroom Supplies', 'Desks & Chairs', 50, 'Seating for students and instructors', '2025-03-30 06:48:33', 8000.00),
(16, 'Classroom Supplies', 'Posters & Wall Charts', 20, 'Educational charts for language learning', '2025-03-30 06:48:33', 1500.00),
(17, 'Office Supplies', 'Pens, Pencils & Erasers', 100, 'Basic writing materials', '2025-03-30 06:48:33', 50.00),
(18, 'Office Supplies', 'Notebooks & Files', 80, 'For taking notes and storing documents', '2025-03-30 06:48:33', 300.00),
(19, 'Office Supplies', 'Staplers & Paper Clips', 30, 'Office stationery for document organization', '2025-03-30 06:48:33', 500.00),
(20, 'Office Supplies', 'Envelopes & Printing Paper', 50, 'Used for official communication and printing', '2025-03-30 06:48:33', 700.00),
(21, 'Maintenance & Utilities', 'Cleaning Supplies', 20, 'Detergents, mops, and other cleaning materials', '2025-03-30 06:48:33', 1500.00),
(22, 'Maintenance & Utilities', 'First Aid Kits', 5, 'For handling minor injuries', '2025-03-30 06:48:33', 5000.00),
(23, 'Maintenance & Utilities', 'Electrical Accessories', 10, 'Extension cables, adapters, etc.', '2025-03-30 06:48:33', 3000.00),
(24, 'Maintenance & Utilities', 'Security Equipment', 8, 'Locks, CCTV cameras, and safety measures', '2025-03-30 06:48:33', 20000.00);

-- --------------------------------------------------------

--
-- Table structure for table `store_requests`
--

CREATE TABLE `store_requests` (
  `id` int(11) NOT NULL,
  `storekeeper_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `quantity_requested` int(11) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected','received') DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_requests`
--

INSERT INTO `store_requests` (`id`, `storekeeper_id`, `item_id`, `supplier_id`, `quantity_requested`, `total_cost`, `status`, `requested_at`) VALUES
(4, 1, 5, 1, 10, 30000.00, 'received', '2025-03-31 16:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `course_enrolled` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance`
--

CREATE TABLE `student_attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `attended_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_attendance`
--

INSERT INTO `student_attendance` (`id`, `student_id`, `tutor_id`, `course_id`, `attended_at`) VALUES
(10, 11, 2, 4, '2025-03-28 13:48:50'),
(11, 3, 3, 1, '2025-03-29 11:43:26');

-- --------------------------------------------------------

--
-- Table structure for table `student_tutors`
--

CREATE TABLE `student_tutors` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('assigned','in_progress','completed') DEFAULT 'assigned',
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_tutors`
--

INSERT INTO `student_tutors` (`id`, `student_id`, `tutor_id`, `assigned_at`, `status`, `course_id`) VALUES
(33, 11, 2, '2025-03-28 13:43:56', 'completed', 4),
(34, 3, 3, '2025-03-29 11:41:07', 'completed', 1);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `username`, `first_name`, `last_name`, `email`, `phone`, `password`) VALUES
(1, 'Atoti', 'Atoti', 'Mwangi', 'atotimwangi@gmail.com', '0798654023', '$2b$10$nj.HqSDiwXxVvJ8tAhI/LuBAZD1imtVPpU1FHoQOYdgM40FaYqcNG'),
(2, 'Webukulu', 'Webukulu', 'Kelvin', 'webukulu.kelvin@gmail.com', '0793124587', '$2b$10$trobHmhy5wo8WLIATkO3q.ePtcIA37LFcY7TMpGaSvh.kVl0i5XCy');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_payments`
--

CREATE TABLE `supplier_payments` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `payment_method` enum('mpesa','bank') NOT NULL,
  `payment_reference` varchar(20) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `request_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_payments`
--

INSERT INTO `supplier_payments` (`id`, `supplier_id`, `total_cost`, `payment_method`, `payment_reference`, `payment_date`, `request_id`) VALUES
(14, 1, 30000.00, 'mpesa', 'QWERT43563', '2025-03-31 16:46:18', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tutors`
--

CREATE TABLE `tutors` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutors`
--

INSERT INTO `tutors` (`id`, `username`, `firstname`, `lastname`, `password`, `email`, `phone`) VALUES
(1, 'Mary', 'Mary', 'Murungi', '$2b$10$/sNcDZW.V.gAc4KiMA2ih.4sUSIFEgnBDi2b3lSHIkOv1nDs4elrm', 'marym@example.com', '0712345678'),
(2, 'Mark', 'Mark', 'Karanja', '$2b$10$9Mu0.BQ7nRV3K4ISJLOVWuRoXRai7J.PIweOmmXRmbe9tBQrvvaRm', 'markk@example.com', '0723456789'),
(3, 'Denis', 'Denis', 'Oliech', '$2b$10$hqKp7XZ3mS2Ir7QoQQbdSOxVLMrwJuaprEWMKUrfYEz7GEJgPsE.W', 'deniso@example.com', '0734567890');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `role` enum('student','admin','tutor','supplier','storekeeper','finance_manager','librarian') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `email`, `phone`, `password`, `is_approved`, `role`, `created_at`) VALUES
(1, 'test_user', 'Test', 'User', 'test@example.com', '0712345678', 'hashedpassword123', 1, 'student', '2025-03-20 05:02:27'),
(2, 'Alloys', 'Alloys', 'Maiko', 'maikoa052@gmail.com', '0796901211', '$2b$10$mY29jNBM8oxlP7t6Mbtx4eW2Kcj4i/J.G95SENi8zc4tEZjumCWui', 1, 'student', '2025-03-20 05:11:25'),
(3, 'Phoebe ', 'Phoebe', 'Siaka', 'phoebensiaka@gmail.com', '0745022309', '$2b$10$OpRKu6TL9V0p/d0sFTOam.uIQ4LapW.kLN50WoJ3g0HSaSBIRiYzu', 1, 'student', '2025-03-20 05:36:33'),
(11, 'Felix', 'Felix', 'Wamunyoro ', 'Felixwamunyoro@gmail.com', '0796901211', '$2b$10$4ypfIkGADSIFNPtARxhmCe.vcqYXAZz.MilL9v0foAZeCeCruF.Fy', 1, 'student', '2025-03-28 13:36:06'),
(12, 'Omwando', 'Omwando ', 'Ishmael', 'Ishamael@gmail.com', '0796901211', '$2b$10$OjZ5pAykRr.3e6zjy58S5OAJ6D10Ec.hF9LoNWnhPb5eauMZbyUwG', 0, 'student', '2025-03-28 21:07:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `tutor_id` (`tutor_id`),
  ADD KEY `librarian_id` (`librarian_id`),
  ADD KEY `finance_manager_id` (`finance_manager_id`),
  ADD KEY `hod_id` (`hod_id`);

--
-- Indexes for table `finance_managers`
--
ALTER TABLE `finance_managers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `hods`
--
ALTER TABLE `hods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `learning_resources`
--
ALTER TABLE `learning_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `librarians`
--
ALTER TABLE `librarians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `resource_requests`
--
ALTER TABLE `resource_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `fk_student_id` (`student_id`);

--
-- Indexes for table `storekeepers`
--
ALTER TABLE `storekeepers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `store_items`
--
ALTER TABLE `store_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_requests`
--
ALTER TABLE `store_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storekeeper_id` (`storekeeper_id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `fk_supplier` (`supplier_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `tutor_id` (`tutor_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `student_tutors`
--
ALTER TABLE `student_tutors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `tutor_id` (`tutor_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `FK_request_id` (`request_id`);

--
-- Indexes for table `tutors`
--
ALTER TABLE `tutors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `finance_managers`
--
ALTER TABLE `finance_managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hods`
--
ALTER TABLE `hods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `learning_resources`
--
ALTER TABLE `learning_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `librarians`
--
ALTER TABLE `librarians`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `resource_requests`
--
ALTER TABLE `resource_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `storekeepers`
--
ALTER TABLE `storekeepers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_items`
--
ALTER TABLE `store_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `store_requests`
--
ALTER TABLE `store_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_attendance`
--
ALTER TABLE `student_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `student_tutors`
--
ALTER TABLE `student_tutors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tutors`
--
ALTER TABLE `tutors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`),
  ADD CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`librarian_id`) REFERENCES `librarians` (`id`),
  ADD CONSTRAINT `feedback_ibfk_4` FOREIGN KEY (`finance_manager_id`) REFERENCES `finance_managers` (`id`),
  ADD CONSTRAINT `feedback_ibfk_5` FOREIGN KEY (`hod_id`) REFERENCES `hods` (`id`);

--
-- Constraints for table `learning_resources`
--
ALTER TABLE `learning_resources`
  ADD CONSTRAINT `learning_resources_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `resource_requests`
--
ALTER TABLE `resource_requests`
  ADD CONSTRAINT `fk_student_id` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `resource_requests_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `store_requests`
--
ALTER TABLE `store_requests`
  ADD CONSTRAINT `fk_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `store_requests_ibfk_1` FOREIGN KEY (`storekeeper_id`) REFERENCES `storekeepers` (`id`),
  ADD CONSTRAINT `store_requests_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `store_items` (`id`);

--
-- Constraints for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_attendance_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_attendance_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_tutors`
--
ALTER TABLE `student_tutors`
  ADD CONSTRAINT `student_tutors_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_tutors_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`);

--
-- Constraints for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  ADD CONSTRAINT `FK_request_id` FOREIGN KEY (`request_id`) REFERENCES `store_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `supplier_payments_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
