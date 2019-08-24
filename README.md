# SayCheese - Intelligent attendance system using facial recognition

In the higher education institutions for making the attendance in class are being used traditional methods. In the beginning or the ending of the laboratory class the attendance is being made on a paper which ﬂows to every student in the class. Usually the student must write his name, group, subgroup and the specialization. This thing is stalling time both for students and for the teachers. Then teacher must write the attendance from the class in their personal diary, usually is an Excel document for each of the students. But this can be avoided and automated if we use artiﬁcial intelligence.

There is a method which can solve the problem namely an attendance system based on detection and face recognition. In the entering of every class there is an IP camera, every teacher will have installed the Desktop application on their laptop. The teacher can turn on the attendance application selecting which laboratory class is teaching at that moment, week, hour and which camera he wants to use, every camera being called depending on the hall name. The students will walk in front of the camera where the face recognition algorithm will register in the database every student is crossing in front of this camera checking if these are signed up for that speciﬁc laboratory class. After the teacher is stopping the attendance, the database and the control panel is being updated. Subsequent, at the end of the semester, can be seen very easy the students situation.

## Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Requirements
* [nodejs](https://nodejs.org/en/) - Main framework
* [Electron](https://electronjs.org/) - Used for deploying the application and User Interface
* [Python 3.6](https://www.python.org)
   * install flask, json, mysql, numpy
* [OpenCV 4.0.0](https://opencv.org/) - Used for facial recognition
* [Facial Recognition](https://github.com/ageitgey/face_recognition) - facial recognition API for Python
* [MySQL](https://www.mysql.com/products/workbench/) - Database for students and teachers

### Usage

Get your repository locally and install npm dependencies

```text
git clone https://github.com/felixrugina97/SayCheese.git;
npm install;
```

Setup Database and .env file You can use saycheese.mwb to create the database.

```text
NODE_ENV = DEVELOPMENT

DB_HOST = <host>
DB_USER = <user>
DB_PASSWORD = <password>
DB_NAME = <database name>
DB_PORT = <port>
DB_MULTIPLE_STATEMANTS = true
```

Run the application

```text
npm start;
```

## System overview
 The system was tested only on **macOS** and tested on two IP cameras and can support more cameras.
### How does it work?

When the application is started initially it will poop a loading screen then it will be redirected to Login screen where the user will enter login data. There are two types of users **Administrator** and **Teacher**. Each of them have an user account associate to them with can Log In on application. The user account being format with an e-mail, password and user type. Password is encrypted in database.

<p align="center">
	<img src="https://i.imgur.com/jbYd9dz.gif"/>
</p>

The communication between Electron and Python is made using Flask. On a Flask server the necessary data to begin the attendance are send from Electron to Python.

There are also some bash scripts that:
* create .log file each time application is started
* run flask server when application is started
* kill flask server when application is stopped

### Users functionalities

Admin have the following functionalities:
* Adding/deleting students from system and map face photo to them
* Adding/deleting teachers from system

Teacher have the following functionalities:
* Start the attendance
* Training knowledge base
* Adding/deleting courses
* Adding/deleting students to their courses
* Export attendance data in Excel format

## Running example

Lets assume that the teacher will make attendance being in the 1st week of university for Algebra course, being at 09:40 in A02 classroom. In teacher dashboard we can see that the data is empty for each student:

![Empty dashboard](https://i.imgur.com/cT4stut.png)

The teacher will press the Start attendance button and will select necessary data to begin the attendance as we can see in the following picture:

<p align="center">
	<img src="https://i.imgur.com/ntP8aGk.png"/ >
</p>

After the attendance is started, students can go in front of the camera to take the attendance for the course. In the following picture we can see the three scenarios that can appear during the facial recognition:
  * In [a] and [b] case there are students that are assigned to the Algebra course and they are identified with success, also it can be seen in what year study, group and subgroup they are
  * In [c] case there is a student that is not assigned to the Algebra course but he is registered in university database. There is a message that shows that (NOT ASSIGNED)
  * In [d] case there is a person that is not registered in university database. There is a message that shows that (Unknown)

![Scenarios](https://i.imgur.com/8pw28Yy.png)

After the teacher will stop the attendance the database will be updated and the teacher dashboard. Normally only for [a] and [b] cases should be updated. As we can see it is updated only for them and the count for the attendances is updated also. For the other students there is no update.

![Updated dashboard](https://i.imgur.com/8XIGlb0.png)

## Ideas for future development
* Implementing liveness detection algorithm. In running example for [b, c, d] cases there are printed photos; this can be a problem because students can come with photos of colleagues from phone. This algorithm will solve this problem
* Training to be done by administrator. Each time new data is added and trained the teacher will receive a notification to update his application

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments
 * [Facial Recognition](https://github.com/ageitgey/face_recognition) API for Python
