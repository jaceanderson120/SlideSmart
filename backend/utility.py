import sys
from pptx import Presentation

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
        text_from_slides[f'{slide_number}'] = text_array
    return text_from_slides

# Run this file from the command line: python3 backend/utility.py powerpoints/01-overview.pptx (create a powerpoint directory locally somewhere)
if __name__ == "__main__":
    # Get the file path from the command line argument
    if len(sys.argv) < 2:
        print("Usage: python utility.py <path_to_ppt>")
        sys.exit(1)

    ppt_path = sys.argv[1]
    
    # Load the PowerPoint file
    ppt = Presentation(ppt_path)

    # Extract text
    extract_text_from_ppt(ppt)
