import 'dotenv/config'

import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "mistral"
});
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabaseClient = createClient(supabaseUrl, supabaseKey)

const embeddings = new OllamaEmbeddings({
    model: "mistral", // default value
    baseUrl: "http://localhost:11434", // default value
});

// 1. Getting the user input
const input = "December 25th is on a Sunday, do I get any extra time off to account for that?";

// 2. Creating an embedding of the input
const embedding = await createEmbeddings(input);

// 3. Retrieving similar embeddings / text chunks (aka "context")
const context = await retrieveMatches(embedding);

// 4. Combining the input and the context in a prompt 
// and using the chat API to generate a response 
const response = await generateChatResponse(context, input);



async function createEmbeddings(chunks) {
    // let embeddingsAndContent = []
    const embedding = await embeddings.embedDocuments([chunks]);

    return embedding;
}


async function retrieveMatches(embedding) {
    // following function is one we create in supabased with sql function and return as response based on the query embedding.
    // console.log(embedding[0])
    const { data, error } = await supabaseClient.rpc('match_handbook_docs', {
        query_embedding: embedding[0], // Pass the embedding you want to compare
        match_threshold: 0.1, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
    })
    return data.map((chunk, i) =>
        chunk.content).join(" ");
    // console.log("data", context)
ß
}
async function generateChatResponse(context, query) {
    const multipleInputPrompt = new PromptTemplate({
        inputVariables: ["query", "context"],
        template: "You are AI assistant based on {context} and {query} give an answer to the user.",
    });
    const formattedMultipleInputPrompt = await multipleInputPrompt.format({
        query: query,
        context: context,
    });

    const stream = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'you are an AI assistant expert in car and help people to understand their need for Handbook. you name is mamu' },
        { role: 'user', content: formattedMultipleInputPrompt }
        ],
        model: 'mistral',
        temperature: 0,
        stream: true,

    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
    // console.log(formattedMultipleInputPrompt)
}