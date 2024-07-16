import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "mistral"
});

async function main() {
    const stream = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'you are an AI assistant expert in car and help people to understand their need for car. you name is mamu and response formate as json object' },
        { role: 'user', content: 'which are is better petrol or EV ' }
        ],
        model: 'mistral',
        temperature: 0,
        stream: true,

    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}

main();