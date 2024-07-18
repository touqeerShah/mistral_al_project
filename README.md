# Mistral AI Project

This small learning project aims to work with Mistral to create your own LLM model and test important features provided by Mistral. The project is based on JavaScript but can incorporate some code logic with Python.

## Prerequisites

Before starting, ensure you have the following installed:
- Node.js
- Ollama

## Installation

### 1. Node.js

If Node.js is not installed, download and install it from [Node.js official website](https://nodejs.org/).
install dependency 
```
npm install
```

### 2. Ollama

To install Ollama, follow the instructions below:

```bash
# For macOS
brew install ollama
```
# For Linux
# Download the latest release from https://github.com/ollama/ollama/releases
# Follow the installation instructions specific to your distribution

## Running Mistral Locally with Ollama
To run Mistral locally with Ollama, follow these steps:

1.Start Ollama: Open your terminal and run the following command:

```
ollama start
```
2. run model

```
 ollama run mistral
```
### Chunking Data
Chunking is a way to break down large pieces of data into smaller chunks. This is useful due to the small window size of context or tokens in AI models, making the data easier to process and create embeddings. We use langchain's text_splitter to split text.


Either you can create access mistral run local with Ollama or go to their website https://mistral.ai/ to get their api keys
in  this example i run it local with my Ollama


to make chunk as embedding we used our mistral model
[example](https://js.langchain.com/v0.2/docs/integrations/text_embedding/ollama)

### Vector store 
we have two option either [chromaDB](https://www.trychroma.com/) or [supabase](https://supabase.com/)(which is extensation of postgress) for supabase we used in this project
to used it we need to setup account and need `API Key ` to access.




example for chromadb create  vector store
```
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb

DATA_PATH="./manual-data"

def load_document_in_index():
    file_extractor = {".pdf": parser}
    documents = SimpleDirectoryReader(
        "./pdf", file_extractor=file_extractor
    ).load_data()

    # documents = SimpleDirectoryReader("pdf").load_data()

    db = chromadb.PersistentClient(path=DATA_PATH)
    chroma_collection = db.get_or_create_collection("manual-data")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context, embed_model=embed_model
    )
    return index.as_query_engine()
```


example for chromadb load load existing vector store
```
from langchain_community.vectorstores import Chroma
DATA_PATH = "./manual-data"
file_path = "./KW23Abstracts.txt"


## load existing vector store
vectorstore = Chroma(
    embedding_function=GPT4AllEmbeddings(),
    persist_directory=DATA_PATH,
    collection_name="manual-data",
)

```

To used supabase need api key and url in `env` file cope from env name from `env-temp`


Once account and key are setup time to create table

```
-- Create a table to store your documents
create table handbook_docs (
  id bigserial primary key,
  content text, -- corresponds to the "text chunk"
  embedding vector(4096) -- 4096 is the dimension of our embeddings
);
```

once we create vector data from text to embedding and store it into `supabase` in file [embedding.js](./embedding.js), not it time to make reteriver and query with llm ,
for those we need function which we user to query  our table and get relative data.
[reference link]("https://supabase.com/docs/guides/ai/vector-columns")

the following function will be create in `supabase` with 

```
create or replace function match_handbook_docs (
  query_embedding vector(4096),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    handbook_docs.id,
    handbook_docs.content,
    1 - (handbook_docs.embedding <=> query_embedding) as similarity
  from handbook_docs
  where 1 - (handbook_docs.embedding <=> query_embedding) > match_threshold
  order by (handbook_docs.embedding <=> query_embedding) asc
  limit match_count;
$$;
```
### Retrieval and Real-Time Data Processing with Agents
Once retrieval is done, we create a prompt and generate output. However, sometimes we need real-time data from the outside world, like weather or stock information. For that, we can create functions that support external retrieval of data and process it with API based on your query. These functions are called agents.

Example
[helper from  stackoverflow](https://stackoverflow.com/questions/78697238/error-in-ollama-functions-js-errorfailed-to-parse-a-function-call-from-this)
[langchain example](https://js.langchain.com/v0.1/docs/integrations/chat/ollama_functions/)
[more llm Example](https://willschenk.com/labnotes/2024/programmatically_interacting_with_llms/)
![ Flow of agent ](./public/flow.png)
