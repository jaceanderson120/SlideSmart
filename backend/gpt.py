import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('@/.env')

# Get the OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")

def analyze_powerpoint(slides_data):
    """Analyzes a PowerPoint's slides_data dictionary using OpenAI's GPT model.

    Args:
    - slides_data: A dictionary where the keys are slide numbers and the values are text and images (in base64).

    Returns:
    - The list of topics and which slides fall under each topic.
    """
    
    client = OpenAI(api_key=openai_api_key)

    user_message = (
        "I am providing you with a python dictionary where the keys are slide numbers and the values are the "
        "text and images (in base64) from the slides. Here is the data: "
        f"{slides_data}. Understand the text and the images and tell me what topics the PowerPoint is about. "
        "Return me a list of topics as well as what slides fall under each topic. Summarize each topic in the PowerPoint and provide an example practice question for each topic."
    )

    # Prepare the request content, inserting the slides_data as context
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional at understanding PowerPoints."},
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    # Return the response message
    return completion.choices[0].message.content
