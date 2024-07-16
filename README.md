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