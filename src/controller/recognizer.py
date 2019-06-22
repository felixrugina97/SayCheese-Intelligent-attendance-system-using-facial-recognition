import cv2
import face_recognition
import json
import mysql.connector
import numpy as np
import os
import pickle
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

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

    for item in final_attendance:
        date = str(item[2]) + " " + str(item[4])
        sql_update_attendance = "UPDATE Attendance SET week" + str(item[3]) + "= %s WHERE studentID = %s AND courseID = %s"
        cursor.execute(sql_update_attendance, (date, str(item[1]), str(item[0]), ))
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
    studentProfile = None
    for row in cursor:
        studentProfile = row

    return studentProfile

def start_attendance(camera, cursor, database, known_faces, known_face_names):
    attendance = []
    studentProfile = []
    unkownFaces = None
    course_id = None
    week = None
    hour = None
    face_locations = []
    face_encodings = []
    process_this_frame = True

    current_path = os.path.dirname(os.path.realpath(__file__))
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
        ret, frame = camera.read()

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        rgb_small_frame = small_frame[:, :, ::-1]

        if process_this_frame:
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

            face_names = []
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(known_faces, face_encoding)
                name = "Unknown"

                face_distances = face_recognition.face_distance(known_faces, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    student_id = known_face_names[best_match_index]
                    student_id = student_id[student_id.find("[")+1:student_id.find("]")]
                    studentProfile = get_profile(student_id, cursor)

                face_names.append(name)

        process_this_frame = not process_this_frame

        for (top, right, bottom, left), name in zip(face_locations, face_names):
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4
            if name != "Unknown":
                if is_assigned_to_course(cursor, studentProfile[0], course_id):
                    cv2.rectangle(frame, (left, top), (right, bottom), (255, 0, 0), 2)

                    cv2.rectangle(frame, (left, bottom + 75), (right, bottom), (255, 0, 0), cv2.FILLED)
                    font = cv2.FONT_HERSHEY_DUPLEX
                    cv2.putText(frame, name, (left + 6, bottom + 28), font, 1.0, (255, 255, 255), 1)
                    cv2.putText(frame, "Y: " + str(studentProfile[6]) + " GR: " + str(studentProfile[7]) + " SGR: " +
                        str(studentProfile[8]), (left + 6, bottom + 65), font, 1.0, (255, 255, 255), 1)
                    attendance.append([course_id, studentProfile[0], datetime.today().strftime('%Y-%m-%d'), week, hour])
                else:
                    cv2.rectangle(frame, (left, top), (right, bottom), (255, 0, 0), 2)

                    cv2.rectangle(frame, (left, bottom + 75), (right, bottom), (255, 0, 0), cv2.FILLED)
                    font = cv2.FONT_HERSHEY_DUPLEX
                    cv2.putText(frame, name, (left + 6, bottom + 28), font, 1.0, (255, 255, 255), 1)
                    cv2.putText(frame, "NOT ASSIGNED", (left + 6, bottom + 65), font, 1.0, (255, 255, 255), 1)
            else:
                cv2.rectangle(frame, (left, top), (right, bottom), (255, 0, 0), 2)

                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (255, 0, 0), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        cv2.imshow('Attendance', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
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

    halls = {
        'F108' : 0,
        '032'  : 1,
    }

    current_path = os.path.dirname(os.path.realpath(__file__))
    hall_create_to = "../../data"
    hall_file_name = "attendance_data.txt"
    hall_file_path = os.path.join(current_path, hall_create_to, hall_file_name)
    hall = None

    hall_data = open(hall_file_path)
    for i, line in enumerate(hall_data):
        if i == 3:
            hall = line
        elif i > 4:
            break
    hall_data.close()

    camera = cv2.VideoCapture(halls[hall])
    configure_camera(camera)

    trained_data = "../../data/trained_data/"
    file_path = os.path.join(current_path, trained_data)

    known_faces = pickle.load(open(file_path + "known_faces","rb"))
    known_faces_names = pickle.load(open(file_path + "known_faces_names","rb"))

    start_attendance(camera, cursor, database, known_faces, known_faces_names)

    camera.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
