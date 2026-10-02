from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
model="openai/gpt-oss-120b"
model2="openai/gpt-oss-20b"
temperature=0.2
max_completion_tokens=900