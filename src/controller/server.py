import json
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/attendanceData', methods=['POST'])
def write_attendance_data():
    attendance_data = request.form
    current_path = os.path.dirname(os.path.realpath(__file__))
    create_to = "../../data"
    file_name = "attendance_data.txt"
    file_path = os.path.join(current_path, create_to, file_name)

    for key in attendance_data.keys():
        data = key
        attendance_dictionary = json.loads(data)

        file = open(file_path, 'w')
        file.write(attendance_dictionary['courseID'] + '\n')
        file.write(attendance_dictionary['week'] + '\n')
        file.write(attendance_dictionary['hour'])
        file.close()

    response = "true"
    return response
