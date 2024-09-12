from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
from flask import Flask, jsonify
from flask_cors import CORS
import io
import base64

app = Flask(__name__)
CORS(app)

def extract_text_and_images_from_ppt(ppt):
    """Extract all text and images from a PowerPoint and return two dictionaries of arrays.

    Arguments:
    - ppt: the PowerPoint to parse

    Returns:
    - a dictionary of arrays of the following form: {"slide1": [text1, text2, text3, ...], "slide2": ..., "slide3": ...}
    - a dictionary of arrays of the following form: {"slide1": [image1, image2, image3, ...], "slide2": ..., "slide3": ...}
    """
    
    text_from_slides = {}
    images_from_slides = {}

    for slide_number, slide in enumerate(ppt.slides, start=1):
        text_array = []
        image_array = []

        for shape in slide.shapes:
            if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
                # Must convert images to base64 so that they can be jsonify'd
                image_stream = io.BytesIO(shape.image.blob)
                base64_image = base64.b64encode(image_stream.read()).decode('utf-8')
                image_array.append(base64_image)
            if not shape.has_text_frame:
                continue
            for paragraph in shape.text_frame.paragraphs:
                for run in paragraph.runs:
                    text_array.append(run.text)

        # If text_array has text, append it to the dictionary with corresponding slide #
        if(text_array):
            text_from_slides[f'slide{slide_number}'] = text_array

        # If image_array has images, append it to the dictionary with corresponding slide #
        if(image_array):
            images_from_slides[f'slide{slide_number}'] = image_array

    return text_from_slides, images_from_slides

@app.route('/extract', methods=['POST'])
def upload_file():
    file_path = "01-overview.pptx" # Currently this is a PowerPoint in my local root directory, change this to accept PowerPoints from the frontend
    ppt = Presentation(file_path)
    extracted_text, extracted_images = extract_text_and_images_from_ppt(ppt)
    return jsonify({
        'text': extracted_text,
        'images': extracted_images
    })

if __name__ == "__main__":
    app.run(debug=True)
