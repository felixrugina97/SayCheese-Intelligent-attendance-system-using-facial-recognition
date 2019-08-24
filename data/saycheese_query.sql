-- # ---- Create User + Admin ------- #
-- START TRANSACTION;
-- 	INSERT INTO Saycheese.User (email, password, userType)
-- 	VALUES ('admin@e-uvt.ro', SHA2('adminUVT!', 256), 0);
--
-- 	INSERT INTO Saycheese.Admin (userID, firstName, lastName)
--     SELECT User.ID, 'Mircea', 'Chitune'
--     FROM Saycheese.User
--     ORDER BY ID DESC LIMIT 1;
-- COMMIT;
-- # ------------------------------#

-- # --- Create User + Teacher --- #
-- START TRANSACTION;
-- 	INSERT INTO User (email, password, userType)
-- 	VALUES ('bogdan@e-uvt.ro', SHA2('bogdan!', 256), 1);
-- --
-- 	INSERT INTO Teacher(userID, firstName, lastName, university)
--     SELECT User.ID, 'Bogdan', 'Treica', 'Facultatea de Matematica-Informatica'
--     FROM USER
--     ORDER BY ID DESC LIMIT 1;
-- COMMIT;

-- START TRANSACTION;
-- 	INSERT INTO User (email, password, userType)
-- 	VALUES ('mihai@e-uvt.ro', SHA2('mihai!', 256), 1);
--
-- 	INSERT INTO Teacher(userID, firstName, lastName, university)
--     SELECT User.ID, 'Mihai', 'Rosian', 'Facultatea de Matematica-Informatica'
--     FROM USER
--     ORDER BY ID DESC LIMIT 1;
-- COMMIT;

-- START TRANSACTION;
-- 	INSERT INTO User (email, password, userType)
-- 	VALUES ('bogdan@e-uvt.ro', SHA2('bogdan!', 256), 1);
--
-- 	INSERT INTO Teacher(userID, firstName, lastName, university)
--     SELECT User.ID, 'Bogdan', 'Treica', 'Facultatea de Matematica-Informatica'
--     FROM USER
--     ORDER BY ID DESC LIMIT 1;
-- COMMIT;
-- # ------------------------------#

-- # --- Create Courses --- #
-- INSERT INTO Course (teacherID, courseName, courseType) VALUES (2, 'Programare 1', 0);
-- INSERT INTO Course (teacherID, courseName, courseType) VALUES (2, 'Algoritmica', 0);
-- INSERT INTO Course (teacherID, courseName, courseType) VALUES (3, 'Algebra', 1);
-- INSERT INTO Course (teacherID, courseName, courseType) VALUES (4, 'Probabilitati', 0);
-- # ------------------------------#

-- # --- Create Students --- #
-- INSERT INTO Student
-- 	(firstName, lastName, university, Student.profile, specialization,
-- 	studyYear, Student.group, subgroup, registrationNumber)
-- VALUES
-- 	('Marcel', 'Pavel', 'Matematica-Informatica', 'Informatica', 'Informatica Aplicata',
--     3, 4, 5, 292);
--
-- INSERT INTO Student
-- 	(firstName, lastName, university, Student.profile, specialization,
-- 	studyYear, Student.group, subgroup, registrationNumber)
-- VALUES
-- 	('Irina', 'Login', 'Matematica-Informatica', 'Informatica', 'Informatica Aplicata',
--     3, 4, 5, 292);
--
-- INSERT INTO Student
-- 	(firstName, lastName, university, Student.profile, specialization,
-- 	studyYear, Student.group, subgroup, registrationNumber)
-- VALUES
-- 	('Pavel', 'Ovidiu', 'Matematica-Informatica', 'Informatica', 'Informatica Romana',
--     4, 2, 6, 192);

-- SELECT * FROM SayCheese.User WHERE User.ID = (SELECT ID FROM SayCheese.Teacher WHERE ID = 3);

-- SELECT ID FROM Student WHERE
-- 	Student.specialization = 'Informatica Aplicata' AND
--     Student.studyYear = 3 AND
--     Student.group = 4 AND
--     Student.subgroup = 5;

-- SELECT DISTINCT Course.courseName, Student.specialization, Student.studyYear, Student.group, Student.subgroup
-- FROM Student_Courses_Assignment
-- JOIN Student ON Student_Courses_Assignment.Student_ID = Student.ID
-- JOIN Course ON Student_Courses_Assignment.Course_ID = Course.ID
-- WHERE Course.ID = 183;

-- START TRANSACTION;
-- DELETE Student_Courses_Assignment FROM Student_Courses_Assignment
-- JOIN Student ON Student_Courses_Assignment.studentID = Student.ID
-- JOIN Course ON Student_Courses_Assignment.courseID = Course.ID
-- WHERE Student.profile = 4 AND Student.specialization = 4 AND Student.studyYear = 4
-- AND Student.group = 4 AND Student.subgroup = 4;
-- DELETE FROM Attendance WHERE Attendance.courseID = ?;
-- COMMIT;

-- START TRANSACTION;
-- DELETE FROM Student_Courses_Assignment WHERE Student_Courses_Assignment.CourseID = 191;
-- DELETE FROM Attendance WHERE Attendance.courseID = 191;
-- DELETE FROM Course WHERE Course.ID = 191;
-- COMMIT;

-- INSERT IGNORE INTO Student_Courses_Assignment (courseID, studentID) VALUES(183, 1);
