import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

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

            When a customer asks about the status, location,
            progress, or delivery of a shipment, use the get_shipment_status tool
            when the customer provides a tracking number. 
            If they ask about a shipment but don't provide a tracking number, ask them for it.

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
            }
        ]
    });

    return response;
};