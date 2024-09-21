from openai import OpenAI
import ast

def analyze_powerpoint(slides_data):
    """Analyzes a PowerPoint's slides_data dictionary using OpenAI's GPT model.

    Args:
    - slides_data: A dictionary where the keys are slide numbers and the values are text and images (in base64).

    Returns:
    - The list of topics and which slides fall under each topic.
    """
    
    client = OpenAI()

    user_message = (
        "I am providing you with a python dictionary where the keys are slide numbers and the values are "
        f"arrays of text from the slide. Here is the data: {slides_data}"
        "Understand the text and tell me what topics the PowerPoint is about. "
        "Summarize each topic in the PowerPoint and provide an example practice question for each topic. "
        "When you summarize a topic, summarize it as if you are teaching it to me in a few sentences or a paragraph. "
        "Return the data that you gather as a python dictionary where each key is the name of a topic "
        "and each value is an array that contains a summary of the topic, slide numbers that deal with that topic, "
        "and one practice problem. Return nothing besides a python dictionary please."
    )

    # Prepare the request content, inserting the slides_data as context
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional at interpreting PowerPoints created by professors. Your goal is to make the PowerPoint extremely easy for a student to understand."},
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    response = completion.choices[0].message.content
    clean_response = response.replace("```python", "").replace("```", "").strip()
    extracted_dict = ast.literal_eval(clean_response)

    # Return the response message
    return extracted_dict
