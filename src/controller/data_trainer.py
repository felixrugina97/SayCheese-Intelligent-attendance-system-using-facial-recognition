import pickle
import cv2
import face_recognition
import json
import mysql.connector
import numpy as np
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('../..') / '.env'
load_dotenv(dotenv_path=env_path)

known_faces = []
known_face_names = []

def add_known_face(filename, cursor):
    sql = "SELECT Student.ID, Student.firstName, Student.lastName FROM Student WHERE ID = %s"
    cursor.execute(sql, (filename, ))

    result = cursor.fetchall()

    for face in result:
        known_face_names.append('[' + str(face[0]) + ']' + str(face[1]) + " " + str(face[2]))

def main():
    database = mysql.connector.connect(
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        passwd = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )
    cursor = database.cursor()

    current_path = os.path.dirname(os.path.realpath(__file__))
    data_set = "../../data/data_set"
    data_path = os.path.join(current_path, data_set)
    directory = os.fsdecode(data_path)

    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith('.jpg'):
            add_known_face(int(os.path.splitext(filename)[0]), cursor)
            image = face_recognition.load_image_file(os.path.join(directory, filename))
            encod = face_recognition.face_encodings(image)[0]
            known_faces.append(encod)
            continue
        else:
            continue

    create_to = "../../data/trained_data/"
    file_path = os.path.join(current_path, create_to)

    pickle.dump(known_faces,open(file_path + "known_faces","wb"))
    pickle.dump(known_face_names,open(file_path + "known_faces_names","wb"))

if __name__ == '__main__':
    main()