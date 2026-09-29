import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

import { zodTextFormat } from 'openai/helpers/zod';
import { profileSchema } from '../utils/profile.shema.js';
import KnowledgeChunk from '../models/knowledgeChunk.model.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// export const analyzeCustomerMessage = async (messages) => {
//     const response = await openai.responses.create({
//         model: 'gpt-5.6-luna',

//         instructions: `
//             You are an AI system that analyzes SwiftShip customer messages.

//             Determine the customer's intent.

//             Return a JSON object with exactly these fields:

//             {
//                 "intent": string,
//                 "trackingNumber": string | null,
//                 "requiresTool": boolean
//             }

//             Possible intents include:
//             - shipment_tracking
//             - shipping_requirements
//             - shipping_price
//             - delivery_time
//             - general_support

//             Use shipment_tracking when the customer asks about:
//             - the location of a shipment
//             - the current status of a shipment
//             - where a shipment is
//             - shipment progress
//             - delivery progress

//             If the customer provides a tracking number, extract it.

//             Set requiresTool to true when the backend needs
//             external or database information to answer the request.

//             Set requiresTool to false when the request can be answered
//             without accessing external data.

//             Do not include explanations.
//             Return only valid JSON.
//         `,

//         input: messages
//     });

//     return response.output_text;
// };

// export const generateCustomerResponse = async (messages, shipment) => {
//     const response = await openai.responses.create({
//         model: 'gpt-5.6-luna',

//         instructions: `
//             You are a customer support assistant for SwiftShip.

//             Answer the customer's question using the shipment
//             information provided by the backend.

//             Do not invent shipment information.

//             If information is missing, say that you do not have
//             that information.

//             Keep the response clear, concise, and helpful.
//         `,

//         input: [
//             ...messages,
//             {
//                 role: 'system',
//                 content: `Shipment information from the SwiftShip backend:

//                 ${JSON.stringify(shipment)}`
//             }
//         ]
//     });

//     return response.output_text;
// };

export const chatWithAI = async (messages) => {
    const response = await openai.responses.create({
        model: 'gpt-5.6-luna',

        instructions: `
            You are a customer support assistant for SwiftShip.

            Help customers with SwiftShip shipments and services.

            When you need information about SwiftShip policies,
            services, delivery times, damaged shipments, etc.,
            use the get_knowledge tool.

            When a customer asks about the status, location,
            progress, or delivery of a shipment, use the get_shipment_status tool
            when the customer provides a tracking number.

            If they ask about a shipment but don't provide a tracking number,
            ask them for it.

            Do not invent shipment information.

            Only provide shipment information that comes
            from the tool result.
            
        `,

        input: messages,

        tools: [
            {
                type: 'function',
                name: 'get_shipment_status',
                description: 'Get the current status and tracking information for a shipment.',
                parameters: {
                    type: 'object',
                    properties: {
                        trackingNumber: {
                            type: 'string',
                            description: 'The shipment tracking number.'
                        }
                    },
                    required: ['trackingNumber'],
                    additionalProperties: false
                }
            },

            {
                type: 'function',
                name: 'get_knowledge',
                description: 'Get relevant knowledge from the SwiftShip knowledge base.',
                parameters: {
                    type: 'object',
                    properties: {
                        question: {
                            type: 'string',
                            description: 'The customer question to search for in the knowledge base.'
                        }
                    },
                    required: ['question'],
                    additionalProperties: false
                }
            }
        ]
    });

    return response;
};

// export const testStructuredOutput = async () => {
//     try {
//         const response = await openai.responses.parse({
//             model: 'gpt-5.6-luna',

//             input: 'My name is Kemi, I am 25 years old and I live in Port Harcourt.',

//             text: {
//                 format: zodTextFormat(profileSchema, 'profile')
//             }
//         });

//         console.log(response.output_parsed);

//         return response.output_parsed;
//     } catch (error) {
//         console.error(error);

//         throw error;
//     }
// };


// create embedding 
export const createEmbedding = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error creating embedding:', error);
        throw error;
    }
}


export const createKnowledgeChunk = async (content, metadata) => {
    try {
        const embedding = await createEmbedding(content);
        const knowledgeChunk = await KnowledgeChunk.create({
            content,
            embedding,
            metadata
        });
        return knowledgeChunk;
        
    } catch (error) {
        console.error('Error creating knowledge chunk:', error);
        throw error;
    }
}