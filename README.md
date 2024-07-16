# mistral_al_project
This small learning project to work with mistral to create my own llm model and test important feature provide by mistrial

This project is based on javescript but we can used some code logic with python.


Either you can create access mistral run local with Ollama or go to their website https://mistral.ai/ to get their api keys
in  this example i run it local with my Ollama


 
chunking , is way to make small piece of data make it process easily becasues of small window size of context or token with ai , and easy to create embedding
we user langchain text_splitter for split text 

to make chunk as embedding we used our mistral model
referenc https://js.langchain.com/v0.2/docs/integrations/text_embedding/ollama