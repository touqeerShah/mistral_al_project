import 'dotenv/config'

import { promises as fs } from "fs";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { createClient } from '@supabase/supabase-js'

// const openai = new OpenAI({
//     baseURL: "http://localhost:11434/v1",
//     apiKey: "mistral"
// });
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const embeddings = new OllamaEmbeddings({
    model: "mistral", // default value
    baseUrl: "http://localhost:11434", // default value
});
async function splitDocument(path) {
    try {
        const text = await fs.readFile(path, "utf-8");
        const lines = text.split("\n"); // Splits the document into an array of lines

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 40,
        });
        const output = await splitter.createDocuments([text]);
        // console.log(output[0].metadata);
        return output.map((chunk) => chunk.pageContent);
    } catch (error) {
        console.error("Failed to read the document:", error);
    }
}

// console.log(await splitDocument("./handbook.txt"));
let handbookChunks = await splitDocument("./handbook.txt");

async function createEmbeddings(chunks) {
    // let embeddingsAndContent = []
    const embedding = await embeddings.embedDocuments(chunks);
    const embeddingsAndContent = chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embedding[i],
        };
    });
    return embeddingsAndContent;
}

// const documents = ["Hello World!", "Bye Bye"];

// const documentEmbeddings = await embeddings.embedDocuments(documents);
// console.log("handbookChunks",handbookChunks)
const data_embedding = await createEmbeddings(handbookChunks);
console.log("data_embedding done !")

let count=0
data_embedding.forEach(async(insertData) => {
    count+=1
    const { data, error } = await supabase
        .from('handbook_docs')
        .insert([insertData]);

    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Upload complete!");
        console.log("Inserted rows:", count);
    }

    console.log("Data, error:", data, error);
});

