from pptx import Presentation
from flask import Flask, jsonify
from flask_cors import CORS

# NOTICE: Need to add a `requirements.txt` file. Packages needed are listed above this comment.

app = Flask(__name__)
CORS(app)

def extract_text_from_ppt(ppt):
    """Extract all text from a PowerPoint and return a dictionary of arrays.

    Arguments:
    - ppt: the PowerPoint to parse

    Returns:
    - a dictionary of arrays of the following form: {"slide1": [text1, text2, text3, ...], "slide2": ..., "slide3": ...}
    """
    
    text_from_slides = {}

    for slide_number, slide in enumerate(ppt.slides, start=1):
        text_array = []
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            for paragraph in shape.text_frame.paragraphs:
                for run in paragraph.runs:
                    text_array.append(run.text)
        text_from_slides[f'slide{slide_number}'] = text_array
    return text_from_slides

@app.route('/extract', methods=['POST'])
def upload_file():
    file_path = "01-overview.pptx" # Currently this is a PowerPoint in my local root directory, change this to accept PowerPoints from the frontend
    ppt = Presentation(file_path)
    extracted_text = extract_text_from_ppt(ppt)

    return jsonify(extracted_text)

if __name__ == "__main__":
    app.run(debug=True)
