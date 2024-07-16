import { promises as fs } from 'fs';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";


// const openai = new OpenAI({
//     baseURL: "http://localhost:11434/v1",
//     apiKey: "mistral"
// });

const embeddings = new OllamaEmbeddings({
    model: "mistral", // default value
    baseUrl: "http://localhost:11434", // default value
});
async function splitDocument(path) {
    try {
        const text = await fs.readFile(path, 'utf-8');
        const lines = text.split('\n'); // Splits the document into an array of lines

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 250,
            chunkOverlap: 40
        });
        const output = await splitter.createDocuments([text]);
        // console.log(output[0].metadata);
        return output.map(chunk => chunk.pageContent);
    } catch (error) {
        console.error('Failed to read the document:', error);
    }
}

// console.log(await splitDocument("./handbook.txt"));
let chunks = await splitDocument("./handbook.txt")

async function createEmbeddings(chunks) {
    // let embeddingsAndContent = []
    const embedding = await embeddings.embedDocuments(chunks);
    const embeddingsAndContent = chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embedding[i]
        }
    });
    return embeddingsAndContent;
    // chunks.forEach(async (chunk) => {

    //     embeddingsAndContent.push({
    //         content: chunk,
    //         embedding: embedding
    //     })
    // });
    // return embeddingsAndContent;

}

// const documents = ["Hello World!", "Bye Bye"];

// const documentEmbeddings = await embeddings.embedDocuments(documents);

console.log(await createEmbeddings(chunks));