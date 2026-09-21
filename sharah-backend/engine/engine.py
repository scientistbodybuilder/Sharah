import glob
from pathlib import Path
from groq_config import client as groq_client, model as groq_model, temperature, max_completion_tokens
# from gemini_config import client as gemini_client, model as gemini_model
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from google.genai import types

# class LLM_Verdict(BaseModel):
#     suggestion: str = Field(description="Suggestion for the compliance of the chunk among: compliant | non-compliant | uncertain.")
#     confidence: int = Field(description="Confidence level of the verdict (0-100).")
#     summary: str = Field(description="Summary of the analysis.")
#     reasoning: str = Field(description="Detailed explanation of the analysis, referencing the context document.")
#     citation: str = Field(description="Citation of the relevant Shariah Standard from the knowledge base.")

# class Gemini_Response(BaseModel):
#     verdicts: List[LLM_Verdict] = Field(description="List of LLM verdicts from the inputted chunks.")


# Path to shariah knowledge base chunks
SHARIAH_KB_PATH = Path(__file__).parent.parent / "data" / "knowledge_base"

# consider making concurrent request
async def llm_verification_v1(ruling: str, chunk: str, chunk_page: int):

    context_files = glob.glob(str(SHARIAH_KB_PATH / f"*{ruling}*.md"))
    print("Context files found:", context_files)
    # context = [f for f in context_files if ruling in f.split('/')]
    
    with open(context_files[0], 'r', encoding='utf-8') as f:
        content = f.read() # chunk content, will be knowledge base for llm

        system_prompt = f"""You are SHARAH, an expert Islamic finance compliance analyzer for student loan agreements. 
        Your task is to analyze a passage from a student loan agreement for Shariah compliance. Reason purely based on the information from this knowledge base:
                -- {content} --
        
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
        
        Provide your Shariah compliance analysis in JSON format."""

        try:
            response = groq_client.chat.completions.create(
                model=groq_model,
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
                'model_used': groq_model,
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
                "suggestion": "uncertain",
                "metadata": {
                    'chunk': chunk,
                    'ruling': ruling,
                    'model_used': groq_model,
                    'error': str(e)
                }
            }


# async def llm_verification_v2(ruling: str, chunkList: List[dict]):

#     context_files = glob.glob(str(SHARIAH_KB_PATH / f"*{ruling}*.md"))
#     print("Context files found:", context_files)
#     # context = [f for f in context_files if ruling in f.split('/')]
    
#     with open(context_files[0], 'r', encoding='utf-8') as f:
#         content = f.read() # chunk content, will be knowledge base for llm

#         prompt = f"""
#         SYSTEM PROMPT:** You are SHARAH, an expert Islamic finance compliance analyzer for student loan agreements. 
#         Your task is to analyze a passage from a student loan agreement for Shariah compliance. Reason purely based on the information from this knowledge base:
#                 -- {content} --
        
#         You must evaluate based on the principle of {ruling}
        
#         Use the provided Shariah knowledge sources to inform your analysis.
#         Be precise, cite specific concerns, and provide a clear verdict.
        
#         Respond in JSON format with the following structure:
#         {{
#             "suggestion": "compliant" | "non-compliant" | "uncertain",
#             "confidence": 0-100,
#             "summary": "summary explaining findings with concise references to the context and the passage",
#             "reasoning": "Detailed explanation of the analysis, referencing the context document",
#             "citation": "Citation on the relevant Shariah Standard from the knowledge base"
#         }}
#         **

#         USER PROMPT:**

#         Analyze the following list of chunks of a financial product/contract for Shariah compliance to the principle of {ruling}:
        
#         --- CONTRACT PASSAGE ---
#         {chunkList}

#         **
#         """

#         # user_prompt = f"""Analyze the following passage of a financial product/contract for Shariah compliance to the principle of {ruling}:
        
#         # --- CONTRACT PASSAGE ---
#         # {chunk}
        
#         # Provide your Shariah compliance analysis in JSON format."""

#         try:
#             # interaction = gemini_client.interactions.create(
#             #     model=gemini_model,
#             #     input=prompt,
#             #     response_format={
#             #         "type": "json_object",
#             #         "mime_type": "application/json",
#             #         "schema": Gemini_Response.model_json_schema()
#             #     }
#             # )
#             response = gemini_client.models.generate_content(
#                 model=gemini_model,
#                 contents=prompt,
#                 config=types.GenerateContentConfig(
#                     response_mime_type="application/json",
#                     response_schema=Gemini_Response,
#                 ),
#             )


#             result: Gemini_Response = response.parsed
#             print("gemini result:", result)
#             # Extract the response content
#             # result_text = response.choices[0].message.content
#             # print("LLM RESPONSE TEXT: ", result_text)
#             # # Parse JSON response
#             # import json
#             # result = json.loads(result_text)
            
#             # # Add metadata about which chunks were used
#             # result['metadata'] = {
#             #     'chunkList': chunkList,
#             #     'ruling': ruling,
#             #     'model_used': model,
#             #     # 'chunk_page': chunk_page
#             # }
            
#             # return result
                
#         except Exception as e:
#             print('Error getting LLM response: ', e)
#             # return {
#             #     "verdict": "ERROR",
#             #     "confidence": 0,
#             #     "summary": f"Analysis failed: {str(e)}",
#             #     "reasoning": f"An error occurred during analysis: {str(e)}",
#             #     "metadata": {
#             #         'chunkList': chunkList,
#             #         'ruling': ruling,
#             #         'model_used': model,
#             #         'error': str(e)
#             #     }
#             # }


