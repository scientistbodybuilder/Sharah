import os
import glob
import re
from pathlib import Path
from groq_config import client, model, temperature, max_completion_tokens
# from openai_config import client, model
# # from openai import OpenAI
# # from dotenv import load_dotenv

# # # Load environment variables
# # load_dotenv()

# # # Initialize OpenAI client
# # client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Path to shariah knowledge base chunks
SHARIAH_KB_PATH = Path(__file__).parent.parent / "data" / "knowledge_base"


# def extract_keywords_from_chunk(content: str) -> list[str]:
#     """
#     Extract keywords from a markdown chunk.
#     Keywords are expected on the second line in format: Keywords: keyword1, keyword2, ...
#     """
#     # lines = content.split('\n')
    
#     # for line in lines:
#     #     if line.lower().startswith('keywords:'):
#     #         # Extract the part after "Keywords:"
#     #         keywords_str = line.split(':', 1)[1].strip()
#     #         # Split by comma and strip whitespace
#     #         keywords = [kw.strip().lower() for kw in keywords_str.split(',')]
#     #         return keywords
#     p = content.split('Keywords:')
#     if len(p) > 1:
#         words = p[1].split('#')[0].strip()
#         return words.split(',')
#     return []


# def get_chunks(text: str) -> list[dict]:
#     """
#     Receives a string text, loops through markdown chunks in shariah_kb,
#     parses text, extracts keywords, and checks if text contains any keywords.
#     Returns list of matching chunks with their content and metadata.
#     """
#     matching_chunks = []
#     text_lower = text.lower()
    
#     # Get all markdown files in shariah_kb directory
#     chunk_files = glob.glob(str(SHARIAH_KB_PATH / "*.md"))
    
#     for chunk_file in chunk_files:
#         with open(chunk_file, 'r', encoding='utf-8') as f:
#             content = f.read()
        
#         # Extract keywords from this chunk
#         keywords = extract_keywords_from_chunk(content)
        
#         # Check if any keyword is present in the text
#         matched_keywords = []
#         for keyword in keywords:
#             # Use word boundary matching for more accurate detection
#             pattern = r'\b' + re.escape(keyword) + r'\b'
#             if re.search(pattern, text_lower):
#                 matched_keywords.append(keyword)
        
#         # If we found matching keywords, add this chunk to the list
#         if matched_keywords:
#             chunk_info = {
#                 'filename': os.path.basename(chunk_file),
#                 'title': content.split('\n')[0],
#                 'content': content,
#                 'matched_keywords': matched_keywords,
#                 'all_keywords': keywords
#             }
#             # print("matched_chunk: ",chunk_info)
#             matching_chunks.append(chunk_info)
#     print("Matching chunks: ",[{'title':x['title'], 'keywords': x['matched_keywords']} for x in matching_chunks])
#     return matching_chunks


# def format_chunks(chunks: list[dict]) -> str:
#     """
#     Receives a list of chunks and formats them into a single string
#     suitable for use as context in a prompt.
#     """
#     if not chunks:
#         return "No relevant Shariah knowledge chunks found."
    
#     formatted_parts = []
    
#     for i, chunk in enumerate(chunks, 1):
#         header = f"=== Relevant Shariah Source {i}: {chunk['title']} ==="
#         content = chunk['content']
        
#         formatted_parts.append(f"{header}\n\n{content}")
    
#     return "\n\n" + "=" * 60 + "\n\n".join(formatted_parts)


# async def analyze_shariah_compliance(text: str, model: str = "gpt-4o-mini") -> dict:
#     """
#     Receives text, finds relevant chunks using get_chunks, formats the chunks,
#     and constructs a prompt to call OpenAI API for Shariah compliance analysis.
    
#     Args:
#         text: The product/contract description to analyze
#         model: OpenAI model to use (default: gpt-4o-mini)
    
#     Returns:
#         dict with analysis results including verdict, confidence, and reasoning
#     """
#     # Step 1: Get relevant chunks based on keywords in the text
#     chunks = get_chunks(text)
    
#     # Step 2: Format chunks into context string
#     context = format_chunks(chunks)
    
#     # Step 3: Construct the prompt
#     system_prompt = """You are SHARAH, an expert Islamic finance compliance analyzer. 
# Your task is to analyze financial products and contracts for Shariah compliance.

# You must evaluate based on the following core principles:
# 1. **Riba (Interest)**: Any form of interest on loans is strictly prohibited
# 2. **Gharar (Uncertainty)**: Excessive uncertainty in contract terms is prohibited
# 3. **Maysir (Gambling)**: Speculative transactions are prohibited
# 4. **Asset-backing**: Transactions should be backed by real assets or services

# Use the provided Shariah knowledge sources to inform your analysis.
# Be precise, cite specific concerns, and provide a clear verdict.

# Respond in JSON format with the following structure:
# {
#     "suggestion": "compliant" | "non-compliant" | "uncertain",
#     "confidence": 0-100,
#     "summary": "summary explaining findings with concise references to chunks and text",
#     "issues": [
#         {
#             "principle": "riba|gharar|maysir|other",
#             "description": "Specific issue found",
#             "severity": "high|medium|low"
#         }
#     ],
#     "reasoning": "Detailed explanation of the analysis, referencing the context document"
# }"""

#     user_prompt = f"""Analyze the following financial product/contract for Shariah compliance:

# --- PRODUCT/CONTRACT DESCRIPTION ---
# {text}

# --- RELEVANT SHARIAH KNOWLEDGE BASE ---
# {context}

# Provide your Shariah compliance analysis in JSON format."""

#     # Step 4: Call OpenAI API
#     try:
#         response = await client.chat.completions.create(
#             model=model,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": user_prompt}
#             ],
#             response_format={"type": "json_object"},
#             temperature=0.2  # Lower temperature for more consistent analysis
#         )
        
#         # Extract the response content
#         result_text = response.choices[0].message.content
        
#         # Parse JSON response
#         import json
#         result = json.loads(result_text)
        
#         # Add metadata about which chunks were used
#         result['metadata'] = {
#             'chunks_used': [c['filename'] for c in chunks],
#             'total_chunks_matched': len(chunks),
#             'model_used': model
#         }
        
#         return result
        
#     except Exception as e:
#         return {
#             "verdict": "ERROR",
#             "confidence": 0,
#             "summary": f"Analysis failed: {str(e)}",
#             "issues": [],
#             "recommendations": [],
#             "reasoning": f"An error occurred during analysis: {str(e)}",
#             "metadata": {
#                 'chunks_used': [c['filename'] for c in chunks],
#                 'total_chunks_matched': len(chunks),
#                 'error': str(e)
#             }
#         }

# consider making concurrent request
async def llm_verification(ruling: str, chunk: str, chunk_page: int):

    context_files = glob.glob(str(SHARIAH_KB_PATH / f"*{ruling}*.md"))
    print("Context files found:", context_files)
    # context = [f for f in context_files if ruling in f.split('/')]
    
    with open(context_files[0], 'r', encoding='utf-8') as f:
        content = f.read() # chunk content, will be knowledge base for llm

        system_prompt = f"""You are SHARAH, an expert Islamic finance compliance analyzer for student loan agreements. 
        Your task is to analyze a passage from a student loan agreement for Shariah compliance.
        
        You must evaluate based on the principle of {ruling}
        
        Use the provided Shariah knowledge sources to inform your analysis.
        Be precise, cite specific concerns, and provide a clear verdict.
        
        Respond in JSON format with the following structure:
        {{
            "suggestion": "compliant" | "non-compliant" | "uncertain",
            "confidence": 0-100,
            "summary": "summary explaining findings with concise references to the context and the passage",
            "reasoning": "Detailed explanation of the analysis, referencing the context document",
            "citation": "Citation on the relevant Shariah Standard from the knowledge base"
        }}
        """

        user_prompt = f"""Analyze the following passage of a financial product/contract for Shariah compliance to the principle of {ruling}:
        
        --- CONTRACT PASSAGE ---
        {chunk}
        
        --- RELEVANT SHARIAH KNOWLEDGE BASE ---
        {content}
        
        Provide your Shariah compliance analysis in JSON format."""

        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_completion_tokens=max_completion_tokens,
                stream=False,
                reasoning_effort="medium",
                temperature=temperature  # Lower temperature for more consistent analysis
            )
            
            # Extract the response content
            result_text = response.choices[0].message.content
            print("LLM RESPONSE TEXT: ", result_text)
            # Parse JSON response
            import json
            result = json.loads(result_text)
            
            # Add metadata about which chunks were used
            result['metadata'] = {
                'chunk': chunk,
                'ruling': ruling,
                'model_used': model,
                'chunk_page': chunk_page
            }
            
            return result
                
        except Exception as e:
            print('Error getting LLM response: ', e)
            return {
                "verdict": "ERROR",
                "confidence": 0,
                "summary": f"Analysis failed: {str(e)}",
                "reasoning": f"An error occurred during analysis: {str(e)}",
                "metadata": {
                    'chunk': chunk,
                    'ruling': ruling,
                    'model_used': model,
                    'error': str(e)
                }
            }


