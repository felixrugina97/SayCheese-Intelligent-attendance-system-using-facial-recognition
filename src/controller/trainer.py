import os
import cv2
import numpy as np
from PIL import Image

def train_data(file_path):
    imagePaths = [os.path.join(file_path, f) for f in os.listdir(file_path)]
    faces = []
    ids = []

    for imagePaths in imagePaths:
        face_image = Image.open(imagePaths).convert('L')
        face_np = np.array(face_image, 'uint8')
        ID = int(os.path.split(imagePaths)[-1].split('.')[1])

        faces.append(face_np)
        ids.append(ID)
        cv2.imshow("trainer", face_np)

        if cv2.waitKey(100) & 0xFF == ord('q'):
            break

    return ids, faces

def main():
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    current_path = os.path.dirname(os.path.realpath(__file__))
    to_data = "../../data/data_set"
    file_path = os.path.join(current_path, to_data)

    ids, faces = train_data(file_path)
    recognizer.train(faces, np.array(ids))
    recognizer.save('../../data/recognizer/trainingData.yml')

    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()