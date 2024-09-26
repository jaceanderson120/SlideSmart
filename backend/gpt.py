import os
from openai import OpenAI
from dotenv import load_dotenv
import json

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

    user_message_1 = (
        "I am providing you with a python dictionary where the keys are slide numbers and the values are "
        f"arrays of text from the slide. Here is the dictionary: {slides_data}"
        "Understand the text and tell me what topics the PowerPoint is about. "
        "Summarize each topic in the PowerPoint. "
        "When you summarize a topic, summarize it as if you are teaching it to me in a few sentences or a paragraph. "
        "Return the data as JSON in the format { 'topicName1': 'summary', 'topicName2': 'summary' ... } "
    )

    # Prepare the request content, inserting the slides_data as context
    completion_1 = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional at interpreting PowerPoints created by professors. Your goal is to make the PowerPoint extremely easy for a student to understand. You will respond to all prompts with JSON"},
            {
                "role": "user",
                "content": user_message_1,
            } 
        ],
        response_format={"type": "json_object"}
    )

    response_1 = json.loads(completion_1.choices[0].message.content)

    user_message_2 = (
        "I am providing you with JSON in the following format: { 'topicName1': 'summary', 'topicName2': 'summary' ... }. "
        f"Here is the JSON object: {response_1}. "
        "For each topic, please create a practice problem question. "
        "Return the refined data as JSON in this format: { 'topicName1': { 'question': 'question', 'answer': 'answer' }, 'topicName2': { 'question': 'question', 'answer': 'answer' } ... }."
    )

    completion_2 = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional at generating practice problems given a topic and topic summary. You respond to prompts with JSON"},
            {"role": "user", "content": user_message_2}
        ],
        response_format={"type": "json_object"}
    )

    # Parse the second response as JSON
    response_2 = json.loads(completion_2.choices[0].message.content)

    # Combine both responses into a single JSON object
    combined_response = {
        topic: {
            "summary": response_1[topic],
            "question": response_2.get(topic, {}).get("question", ""),
            "answer": response_2.get(topic, {}).get("answer", "")
        }
        for topic in response_1
    }

    # Return the response message
    return combined_response
