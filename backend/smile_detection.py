import cv2 as cv
import dlib
import numpy as np

from imutils import face_utils
from numpy.linalg import norm
from time import time


def main():
    # Initializing Dlibs face detector and creating the facial landmark predictor
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')


    cap = cv.VideoCapture(0)

    while True:
        ret, image = cap.read()
        # Converting to gray, because the detector works with gray images
        gray_image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)


        # Detecting faces in the grayscale image
        faces = detector(gray_image, 0)

        for face in faces:
            # Determining the facial landmarks for the face region and converting
            # the facial landmark (x, y)-coordinates to a nd.array
            x_face, y_face = face.left(), face.top()
            w_face, h_face = face.right() - x_face, face.bottom() - y_face
            # cv.rectangle(image, (x_face, y_face), (x_face + w_face, y_face + h_face), (0, 255, 0), 2)

            landmarks = predictor(gray_image, face)
            landmarks = face_utils.shape_to_np(landmarks)

            # Drawing the landmarks on the image for (x, y) in landmarks:
            # cv.circle(image, (x, y), 2, (0, 255, 0), -1)

            # Creating a polygon around the mouth landmarks
            mouth_landmarks = landmarks[48:60]
            mouth_poly = np.array(mouth_landmarks, np.int32)
            mouth_poly = mouth_poly.reshape((-1, 1, 2))

            # save the image without the shape area around the mouth !!
            cv.polylines(image, [mouth_poly], True, (0, 255, 0), 2)

            """
            mouth_left_x = landmarks[48, 0] - 8
            mouth_left_y = max(landmarks[50, 1], landmarks[52, 1]) - 8
            mouth_right_x = landmarks[54, 0] + 8
            mouth_right_y = min(landmarks[56, 1], landmarks[58, 1]) + 8

            cv.rectangle(image, (mouth_left_x, mouth_left_y), (mouth_right_x, mouth_right_y), (0, 255, 0), 2)
            """

            # For calculating of the lip-jaw ratio
            jaw_width = norm(landmarks[2] - landmarks[14])
            lips_width = norm(landmarks[54] - landmarks[48])

            lip_jaw_ratio = lips_width / jaw_width

            # When a person smiles the mouth opening is bigger than the distance between the nose and the mouth
            mouth_opening = norm(landmarks[57] - landmarks[51])
            mouth_nose = norm(landmarks[33] - landmarks[51])

            # For calculating of the mouth-to-cheeks and mouth-to-jaw ratio
            mouth_to_cheeks = norm(landmarks[48] - landmarks[3]) + norm(landmarks[54] - landmarks[13])
            mouth_to_jaw = norm(landmarks[48] - landmarks[5]) + norm(landmarks[54] - landmarks[11])

            if lip_jaw_ratio > 0.44:
                if mouth_opening / mouth_nose >= 1.05:
                    # if mouth_to_cheeks < mouth_to_jaw * 1.6:
                    cv.putText(image, 'Smiling!', (x_face, 50), cv.FONT_HERSHEY_SIMPLEX, 2.5, (0, 0, 0), 3)

        # Showing the video stream in the center of the screen
        cv.namedWindow("Output", cv.WINDOW_NORMAL)
        cv.moveWindow("Output", 200, 40)
        cv.resizeWindow("Output", 600, 500)
        cv.imshow("Output", image)

        if cv.waitKey(1) == 27: # 27 is the ASCII code for the ESC key
            break
    # Release the camera and close all OpenCV windows
    cap.release()
    cv.destroyAllWindows()



if __name__ == '__main__':
    main()
