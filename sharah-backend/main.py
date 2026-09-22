"""FastAPI app entry point for SHARAH backend."""
import logging
import os, json, asyncio
import fitz  # PyMuPDF
# from io import BytesIO
from langchain_core.documents import Document
from dotenv import load_dotenv

from fastapi import FastAPI, File, Request, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from langchain_text_splitters import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer

from engine.engine import llm_verification_v1
from engine.rulings import rulings
from engine.sentence_embeddings import get_ruling_embeddings, embed_document_chunk, max_ruling_chunk_similarity
processing_semaphore = asyncio.Semaphore(1)
load_dotenv()

logging.basicConfig(
    level=logging.DEBUG if os.getenv("DEBUG", "false").lower() == "true" else logging.INFO
)
logger = logging.getLogger(__name__)
frontend_url=os.getenv("FRONTEND_URL")

app = FastAPI(
    title="SHARAH API",
    description="Shariah compliance validation for Islamic financial products",
    version="1.0.0",
)

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
    tokenizer=tokenizer,
    chunk_size=120, 
    chunk_overlap=15, 
)


_origins = [
    "http://localhost:5173",
    frontend_url
]
print("origins:", _origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def get_chunk_page(chunk: str, text_pages: list) -> int:
    for i, page_info in enumerate(text_pages):
        if chunk in page_info['text']:
            return page_info['page']
    return -1


def parse_pdf_text(file_bytes: bytes) -> str:
    """
    Parse text content from a PDF file.
    
    Args:
        file_bytes: Raw bytes of the PDF file
        
    Returns:
        Extracted text as a single string
    """
    text_parts = []
    text_pages = []
    
    # Open PDF from bytes
    pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        text = page.get_text()
        if text.strip():
            text_parts.append(text)
        text_pages.append({
            "page": page_num,
            "text": text
        })
    pdf_document.close()
    
    return "\n\n".join(text_parts), text_pages

# @app.post("/api/pipeline")
# async def embed_document(file: UploadFile = File(...)):
#     """
#     Embed a PDF document for further processing.

#     """
#     # Validate file type
#     if not file.filename.lower().endswith('.pdf'):
#         logger.warning(f"Invalid file type uploaded: {file.filename}")
#         raise HTTPException(
#             status_code=400,
#             detail="Invalid file type. Please upload a PDF file."
#         )

#     try:
#             # get the embeddings for the shariah rules
#             ruling_keys = rulings.keys()
#             ruling_embeddings = {}
#             ruling_chunk_matching = {}
#             ruling_llm_response = {}
#             for key in ruling_keys:
#                 ruling_embeddings[key] = get_ruling_embeddings(key)
#                 ruling_chunk_matching[key] = []
#                 ruling_llm_response[key] = []
            

#             print("ruling embeddings: ", ruling_embeddings)
#             # Read file contents
#             logger.info(f"Processing file: {file.filename}")
#             file_bytes = await file.read()
            
#             if not file_bytes:
#                 raise HTTPException(
#                     status_code=400,
#                     detail="Empty file uploaded."
#                 )
            
#             # Parse PDF text
#             logger.debug("Parsing PDF text...")
#             try:
#                 extracted_text, text_pages = parse_pdf_text(file_bytes)
#                 print("extracted text: ", extracted_text)
#             except Exception as pdf_error:
#                 logger.error(f"PDF parsing error: {str(pdf_error)}")
#                 raise HTTPException(
#                     status_code=400,
#                     detail=f"Failed to parse PDF: {str(pdf_error)}"
#                 )
            
#             if not extracted_text.strip():
#                 raise HTTPException(
#                     status_code=400,
#                     detail="No text could be extracted from the PDF. The file may be empty or contain only images."
#                 )
            
#             logger.info(f"Extracted {len(extracted_text)} characters from PDF")
#             # logger.debug(f"First 500 chars: {extracted_text[:500]}")
#             # here we have the extracted text, we should break it into chunks and embed each
#             all_splits = text_splitter.split_documents([Document(page_content=extracted_text)])
#             print("We have", len(all_splits), "splits for the document")

#             #iterate through the chunks
#             for chunk in all_splits:
#                 chunk_embedding = embed_document_chunk(chunk.page_content)
#                 chunk_page = get_chunk_page(chunk.page_content, text_pages)
#                 print("Embedded chunk with length:", len(chunk.page_content))
#                 for ruling in ruling_keys:
#                     similarity = max_ruling_chunk_similarity(chunk_embedding, ruling_embeddings[ruling])
#                     print("similarity:", similarity)
#                     if (similarity > 0.5):  # Adjust threshold as needed
#                         ruling_chunk_matching[ruling].append((chunk, similarity, chunk_page))

#             print("ruling chunk matching: ", ruling_chunk_matching)
#             # sort the similarities and keep top X
#             for ruling in ruling_keys:
#                 similar_chunks = sorted(ruling_chunk_matching[ruling], key=lambda x: x[1], reverse=True)[:10]
#                 print(f"sorted similarity for ruling '{ruling}': ", [s for _, s, _ in similar_chunks])
#                 # for each chunk, use the LLM to verify whether it is a violation of the ruling
#                 # print(f"Similar chunks for ruling '{ruling}':")
#                 for chunk, similarity, chunk_page in similar_chunks:
#                     try:
#                         # print(f"  - Chunk: {chunk.page_content[:100]}... (Similarity: {similarity})")
#                         llm_response = await llm_verification_v1(ruling, chunk.page_content, chunk_page)
#                         ruling_llm_response[ruling].append(llm_response)
#                     except Exception as e:
#                         print("Error occurred during LLM verification:", e)
#                         logger.error(f"Unexpected error during llm verification for ruling '{ruling}': {str(e)}")

#             print("ruling llm response: ", ruling_llm_response)
#             return JSONResponse(
#                 status_code=200,
#                 content={
#                     "success": True,
#                     "filename": file.filename,
#                     "text_length": len(extracted_text),
#                     "data": ruling_llm_response
#                 }
#             )
            
#     except Exception as e:
#         # Catch any unexpected errors
#         logger.exception(f"Unexpected error processing file: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"An unexpected error occurred: {str(e)}"
#         )




@app.post("/api/pipeline-stream")
async def stream(file: UploadFile = File(...)):
    """
    Embed a PDF document for further processing.

    """
    print("STREAM ENDPOINT")
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        logger.warning(f"Invalid file type uploaded: {file.filename}")
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF file."
        )

    try:
            # get the embeddings for the shariah rules
            ruling_keys = rulings.keys()
            ruling_embeddings = {}
            ruling_chunk_matching = {}
            ruling_llm_response = {}
            for key in ruling_keys:
                ruling_embeddings[key] = get_ruling_embeddings(key)
                ruling_chunk_matching[key] = []
                ruling_llm_response[key] = []
            

            #print("ruling embeddings: ", ruling_embeddings)
            # Read file contents
            logger.info(f"Processing file: {file.filename}")
            file_bytes = await file.read()
            
            if not file_bytes:
                raise HTTPException(
                    status_code=400,
                    detail="Empty file uploaded."
                )
            
            # Parse PDF text
            logger.debug("Parsing PDF text...")
            try:
                extracted_text, text_pages = parse_pdf_text(file_bytes)
                # print("extracted text: ", extracted_text)
            except Exception as pdf_error:
                logger.error(f"PDF parsing error: {str(pdf_error)}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to parse PDF: {str(pdf_error)}"
                )
            
            if not extracted_text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="No text could be extracted from the PDF. The file may be empty or contain only images."
                )
            
            logger.info(f"Extracted {len(extracted_text)} characters from PDF")
            # logger.debug(f"First 500 chars: {extracted_text[:500]}")
            # here we have the extracted text, we should break it into chunks and embed each
            all_splits = text_splitter.split_documents([Document(page_content=extracted_text)])
            # print("We have", len(all_splits), "splits for the document")

            #iterate through the chunks
            for chunk in all_splits:
                chunk_embedding = embed_document_chunk(chunk.page_content)
                chunk_page = get_chunk_page(chunk.page_content, text_pages)
                        # print("Embedded chunk with length:", len(chunk.page_content))
                for ruling in ruling_keys:
                    similarity = max_ruling_chunk_similarity(chunk_embedding, ruling_embeddings[ruling])
                    # print("similarity:", similarity)
                    if (similarity > 0.5):  # Adjust threshold as needed
                        ruling_chunk_matching[ruling].append((chunk, similarity, chunk_page))

            # print("ruling chunk matching: ", ruling_chunk_matching)
            # sort the similarities and keep top X
            async def stream_llm_response():
                for ruling in ruling_keys:
                    similar_chunks = sorted(ruling_chunk_matching[ruling], key=lambda x: x[1], reverse=True)[:10]
                    # print(f"sorted similarity for ruling '{ruling}': ", [s for _, s, _ in similar_chunks])
                    # for each chunk, use the LLM to verify whether it is a violation of the ruling
                    # print(f"Similar chunks for ruling '{ruling}':")
                    for chunk, similarity, chunk_page in similar_chunks:
                        llm_response = await llm_verification_v1(ruling, chunk.page_content, chunk_page)
                        yield json.dumps(llm_response) + "\n"
                        await asyncio.sleep(1)

            return StreamingResponse(
                stream_llm_response(), 
                media_type="application/json",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                }
                )
  
            
    except Exception as e:
        # Catch any unexpected errors
        logger.exception(f"Unexpected error processing file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@app.post("/api/pipeline-stream-v2")
async def stream(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    async def stream_llm_response():
        
        async with processing_semaphore:
            extracted_text, text_pages = parse_pdf_text(file_bytes)
            if not extracted_text.strip():
                yield json.dumps({"error": "No text could be extracted from the PDF."}) + "\n"
                return

            all_splits = text_splitter.split_documents([Document(page_content=extracted_text)])

            ruling_keys = rulings.keys()
            ruling_embeddings = {k: get_ruling_embeddings(k) for k in ruling_keys}
            ruling_chunk_matching = {k: [] for k in ruling_keys}

            for chunk in all_splits:
                chunk_embedding = embed_document_chunk(chunk.page_content)
                chunk_page = get_chunk_page(chunk.page_content, text_pages)
                for ruling in ruling_keys:
                    similarity = max_ruling_chunk_similarity(chunk_embedding, ruling_embeddings[ruling])
                    if similarity > 0.5:
                        ruling_chunk_matching[ruling].append((chunk, similarity, chunk_page))

            for ruling in ruling_keys:
                similar_chunks = sorted(ruling_chunk_matching[ruling], key=lambda x: x[1], reverse=True)[:10]
                for chunk, similarity, chunk_page in similar_chunks:
                    llm_response = await llm_verification_v1(ruling, chunk.page_content, chunk_page)
                    yield json.dumps(llm_response) + "\n"
                    await asyncio.sleep(1)

    return StreamingResponse(
        stream_llm_response(),
        media_type="application/json",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


@app.get("/health")
async def health() -> dict:
    """Health check for load balancers and monitoring."""
    return {"status": "ok", "service": "sharah-api"}
