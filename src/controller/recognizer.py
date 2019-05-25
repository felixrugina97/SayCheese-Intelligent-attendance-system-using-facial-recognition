import cv2
import json
import mysql.connector
import numpy as np
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('../..') / '.env'
load_dotenv(dotenv_path=env_path)

def insert_attendance(attendance, database, cursor):
    seen = set()
    final_attendance = []

    for item in attendance:
        current_item = tuple(item)
        if current_item not in seen:
            final_attendance.append(item)
            seen.add(current_item)

    sql_insert_attendance = "INSERT INTO Attendance (CourseID, studentID, date, weekNumber, hour) VALUES (%s, %s, %s, %s, %s)"
    cursor.executemany(sql_insert_attendance, final_attendance)
    database.commit()

def is_assigned_to_course(cursor, student_id, course_id):
    is_assigned = "SELECT * FROM SayCheese.Student_Courses_Assignment WHERE studentID = %s AND courseID = %s"
    cursor.execute(is_assigned, (student_id, course_id,))
    check_if_empty = cursor.fetchone()

    if check_if_empty != None:
        return True
    else:
        return False

def get_profile(student_id, cursor):
    sql_select_id = "SELECT * FROM Student WHERE ID = %s"
    cursor.execute(sql_select_id, (student_id,))
    profile = None
    for row in cursor:
        profile = row

    return profile

def start_attendance(camera, cursor, database):
    current_path = os.path.dirname(os.path.realpath(__file__))

    haarcascade_folder = "../../data/haarcascade"
    haarcascade_file = "haarcascade_frontalface_default.xml"
    haarcascade_path = os.path.join(current_path, haarcascade_folder, haarcascade_file)
    face_cascade = cv2.CascadeClassifier(haarcascade_path)

    recognizer = cv2.face.LBPHFaceRecognizer_create()

    yml_folder = "../../data/recognizer"
    yml_file = "trainingData.yml"
    yml_path = os.path.join(current_path, yml_folder, yml_file)
    recognizer.read(yml_path)

    font = cv2.FONT_HERSHEY_DUPLEX

    attendance = []
    course_id = None
    week = None
    hour = None

    create_to = "../../data"
    file_name = "attendance_data.txt"
    file_path = os.path.join(current_path, create_to, file_name)

    attendance_data = open(file_path)
    for i, line in enumerate(attendance_data):
        if i == 0:
            course_id = line
        if i == 1:
            week = line
        if i == 2:
            hour = line
        elif i > 3:
            break
    attendance_data.close()

    while True:
        ret, img = camera.read()
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, width, height) in faces:
            cv2.rectangle(img, (x, y), (x + width, y + height), (0, 0, 255), 2)
            student_id, conf = recognizer.predict(gray[y : y + height, x : x + width])
            profile = get_profile(student_id, cursor)
            if conf < 60:
                if is_assigned_to_course(cursor, profile[0], course_id):
                    conf = "{0}%".format(round(100 - conf))
                    cv2.putText(img, "[" + str(conf) + "]", (x - 200, y + height), font, 2, (0, 255, 100), 2)
                    cv2.putText(img, str(profile[1]) + " " +str(profile[2]), (x, y + height), font, 2, (0, 255, 0), 2)
                    attendance.append([course_id, profile[0], datetime.today().strftime('%Y-%m-%d'), week, hour])
                else:
                    conf = "{0}%".format(round(100 - conf))
                    cv2.putText(img, "[" + str(conf) + "]", (x - 200, y + height), font, 2, (0, 255, 100), 2)
                    cv2.putText(img, str(profile[1]) + " " +str(profile[2]), (x, y + height), font, 2, (0, 255, 0), 2)
                    cv2.putText(img, "Not assigned to this course", (x, y + height + 50), font, 2, (0, 255, 0), 2)
            else:
                conf = "  {0}%".format(round(100 - conf))
                cv2.putText(img, str(conf), (x, y + height), font, 2, (0, 255, 100), 2)
                cv2.putText(img, "Unknown", (x, y + height + 50), font, 2, (0, 255, 0), 2)

        cv2.imshow('Attendance', img)
        k = cv2.waitKey(30) & 0xff
        if k == 27:
            insert_attendance(attendance, database, cursor)
            break

def configure_camera(camera):
    camera.set(3, 1280)
    camera.set(4, 720)
    camera.set(cv2.CAP_PROP_FPS, 60)

def main():
    database = mysql.connector.connect(
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        passwd = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )
    cursor = database.cursor()

    camera = cv2.VideoCapture(0)
    configure_camera(camera)

    start_attendance(camera, cursor, database)

    camera.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
