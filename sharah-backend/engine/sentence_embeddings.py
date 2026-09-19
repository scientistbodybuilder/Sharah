from transformers.utils import logging
import numpy as np
import torch
# from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from engine.rulings import rulings

logging.set_verbosity_error()
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
# 384 dimensions



# get the ruling embeddings
def get_ruling_embeddings(ruling):
    ruling_text = rulings[ruling]
    ruling_embedding = {}
    sentences = [ruling_text["formal"], ruling_text["plain"]] + ruling_text["examples"]
    with torch.no_grad():
        embeddings = model.encode(sentences, convert_to_tensor=True)
        ruling_embedding["formal"] = embeddings[0]
        ruling_embedding["plain"] = embeddings[1]
        ruling_embedding["example1"] = embeddings[2]
        ruling_embedding["example2"] = embeddings[3]
        #object of embeddings for the ruling
        return ruling_embedding

def embed_document_chunk(text):
    with torch.no_grad():
        return model.encode(text, convert_to_tensor=True)

def max_ruling_chunk_similarity(chunk_embedding, ruling_embeddings):
    max_similarity = -1
    ruling_embedding_keys = ruling_embeddings.keys()
    for key in ruling_embedding_keys:
        embedding = ruling_embeddings[key]
        similarity = chunk_embedding @ embedding.T
        if similarity > max_similarity:
            max_similarity = similarity
    return max_similarity