-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 17, 2022 at 08:17 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tailor`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `cust_id` int(3) NOT NULL,
  `fName` text NOT NULL,
  `lName` text NOT NULL,
  `phno` varchar(13) NOT NULL,
  `email` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `locality` varchar(50) NOT NULL,
  `street` int(3) NOT NULL,
  `password` varchar(100) NOT NULL,
  `token` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`cust_id`, `fName`, `lName`, `phno`, `email`, `dob`, `city`, `state`, `locality`, `street`, `password`, `token`) VALUES
(1, 'Moni', 'Dixit', '2147483647', 'monudixit0007@gmail.com', '2001-11-25', 'Delhi', 'Delhi', 'Nangloi', 11, 'Monu@123', ''),
(2, 'Mini', 'Dixit', '9891690847', 'monu.dixit.ug20@nsut.ac.in', '2021-12-15', 'Delhi', 'Delhi', 'Punjabi Bagh', 13, 'Mini@123', ''),
(3, 'Ekta', 'Dixit', '8882371234', 'www.mhilis0007@gmail.com', '2021-12-23', 'Agra', 'Uttar pradesh', 'Punjabi Bagh', 10, 'Ekta@123', ''),
(4, 'Rohit', 'Dubey', '8967452312', 'xyz0007@gmail.com', '2021-12-22', 'Lucknow', 'Uttar Predesh', 'Vibhav nagar', 3, 'Rohit@123', ''),
(5, 'Ajay', 'Pandey', '3289450921', 'abc0007@gmail.com', '2021-12-23', 'Agra', 'Uttar Predesh', 'Shastri park', 5, 'Ajay@123', ''),
(6, 'Aman', 'Pandey', '1029384756', 'pqrs007@gmail.com', '2021-12-23', 'Ludhiyana', 'Punjab', 'Ram Nagar', 5, 'Aman@123', ''),
(7, 'Monu', 'Dixit', '8377840464', 'monudixit0007@gmail.com', '2022-03-11', 'Delhi', 'Delhi', 'Nangloi', 11, 'm', ''),
(8, 'Monu', 'Dixit', '8377840464', 'mahakgoud73@gmail.com', '2022-03-11', 'Delhi', 'Delhi', 'Nangloi', 11, 'monu', ''),
(9, 'Monu', 'Dixit', '8377840464', 'monudixit0007@gmail.com', '2022-03-11', 'Delhi', 'Delhi', 'Nangloi', 11, '$2a$10$jYmH5c8wi9tw4aOx0y7PpOw.29PfUB9NbmNMA5EIhAKed8JsJ3sTC', ''),
(10, 'Monu', 'Dixit', '8377840464', 'onudixit0007@gmail.com', '2022-03-11', 'Delhi', 'Delhi', 'Nangloi', 11, '$2a$10$hW6tmJU7TUth/YskFhhgGez7B1RQL5sbOn2DTKSLB5nFX/WgMCIaO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJvbnVkaXhpdDAwMDdAZ21haWwuY29tIiwiaWF0IjoxNjQ3MzUxNDgwfQ.RAM2Ow-fBM0EGkLdQN4tNViH_vKCfruyHO-JRGwGnAU'),
(11, 'Monu', 'Dixit', '8377840464', 'monudixit0007@gmail.com', '2022-03-12', 'Delhi', 'Delhi', 'Nangloi', 11, '$2a$10$46gsgHgMf0Fm.9rrPn/X4O0lxroaYXo2qOzrezJQQKhlsye2YAk9.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJtb251ZGl4aXQwMDA3QGdtYWlsLmNvbSIsImlhdCI6MTY0NzM1MTk4OX0.WiWJTZiqoovXKj1TL9mX9YSGU09VUf4fw53cwsJNuR4'),
(12, 'iljc', 'qerf', '8732187', 'monu.dixit.ug20@nsut.ac.i', '2022-03-04', 'efdvev', 'qevd', 'qc', 0, '$2a$10$lIav.c..jdfF5Mv5jRgC6ewIsATSXqr/y9RqccnGKsmpFELc.t4DK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJtb251LmRpeGl0LnVnMjBAbnN1dC5hYy5pIiwiaWF0IjoxNjQ3MzUzOTExfQ.F1a8vTTNTVLOtYHL3-0VCRZk-3HXcKR0RL2misvuA8s'),
(13, 'sdcww', 'weD', '8377840464', 'mixit007@gmail.com', '2022-03-12', 'Delhi', 'Delhi', 'Nangloi', 11, '$2a$10$Ogzis.o040pU8nodejuHr.vr5tlbFCwfmodGyOCgiCGp4FX2FuETu', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJtaXhpdDAwN0BnbWFpbC5jb20iLCJpYXQiOjE2NDczNTQzMzl9.vhbWk5wpRrpyFeIl9lOffFeW0-gWOJPOqI7enq-Nj1o');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`cust_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `cust_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
