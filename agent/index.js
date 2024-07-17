import OpenAI from 'openai';
import { tools, getPaymentDate, getPaymentStatus } from "./tools.js";
// https://stackoverflow.com/questions/78697238/error-in-ollama-functions-js-errorfailed-to-parse-a-function-call-from-this
// https://js.langchain.com/v0.1/docs/integrations/chat/ollama_functions/
import { OllamaFunctions } from "@langchain/community/experimental/chat_models/ollama_functions";
import { HumanMessage,AIMessage } from "@langchain/core/messages";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";


const availableFunctions = {
    getPaymentDate,
    getPaymentStatus
};


async function main(query) {

    const model = new OllamaFunctions({
        temperature: 0.1,
        model: "mistral",
    }).bind({
        functions: tools,
        // You can set the `function_call` arg to force the model to use a function

    });
    const messages = [
        new HumanMessage({
            content: query,
        })
    ];

    const chain = model.pipe(new JsonOutputFunctionsParser())
    const response = await model.invoke(messages);

    console.log(response);
    // Challenge: 
    // Get ahold of the name of the function we should call, and its arguments.
    // We want the function name as a string, but the arguments as an object
    const functionName = response.additional_kwargs.function_call.name;
    const functionArgs = response.additional_kwargs.function_call.arguments;
    console.log(functionName);
    console.log(functionArgs);
    console.log(" functionName Result : ", availableFunctions[functionName](JSON.parse(functionArgs)))
    const functionResponse = availableFunctions[functionName](JSON.parse(functionArgs))
    // messages.push( new HumanMessage({
    //     content: query +" context "+functionName + " response "+functionResponse,
    // }));
    // console.log("messages",messages)
    // const responsev2 = await model.invoke(
    //     new HumanMessage({
    //         content: query +" context "+functionName + " response "+functionResponse,
    //     })
    // );
    // console.log("response v2 ", responsev2);

}

main("when was the transaction T1001 paid?");