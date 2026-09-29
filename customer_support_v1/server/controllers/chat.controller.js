import { chatWithAI } from '../services/ai.service.js';
import { getShipmentStatus } from '../services/shipment.service.js';

import * as conversationService from '../services/conversation.service.js';
import * as knowledgeService from '../services/Knowledge.service.js';

export const chat = async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        let conversation;

        // Get existing conversation or create a new one
        if (conversationId) {
            conversation = await conversationService.getConversationById(
                conversationId
            );

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            conversation = await conversationService.addMessageToConversation(
                conversationId,
                message,
                'user'
            );
        } else {
            conversation = await conversationService.createConversation(
                message,
                'user'
            );
        }

        // Convert MongoDB messages into the format OpenAI expects
        const messages = conversation.messages.map((msg) => ({
            role: msg.role,
            content: msg.content
        }));

        // Send conversation to AI
        const response = await chatWithAI(messages);

        // Check if AI wants to use a tool
        const toolCall = response.output.find(
            (item) => item.type === 'function_call'
        );

        // Handle tool call
        if (toolCall) {
            const toolArguments = JSON.parse(toolCall.arguments);

            if (toolCall.name === 'get_shipment_status') {
                const shipment = await getShipmentStatus(
                    toolArguments.trackingNumber
                );

                console.log('SHIPMENT:', shipment);

                const finalResponse = await chatWithAI([
                    ...messages,
                    ...response.output,
                    {
                        type: 'function_call_output',
                        call_id: toolCall.call_id,
                        output: JSON.stringify(shipment)
                    }
                ]);

                console.log('FINAL RESPONSE:', finalResponse);

                const finalMessage = finalResponse.output.find(
                    (item) => item.type === 'message'
                );

                const text = finalMessage
                    ? finalMessage.content[0].text
                    : 'No message returned from AI.';

                await conversationService.addMessageToConversation(
                    conversation._id,
                    text,
                    'assistant'
                );

                return res.status(200).json({
                    success: true,
                    conversationId: conversation._id,
                    data: text
                });
            }

            if (toolCall.name === 'get_knowledge') {
                const knowledgeContext = await knowledgeService.getKnowledge(
                    toolArguments.question
                );

                console.log('KNOWLEDGE CONTEXT:', knowledgeContext);

                const finalResponse = await chatWithAI([
                    ...messages,
                    ...response.output,
                    {
                        type: 'function_call_output',
                        call_id: toolCall.call_id,
                        output: knowledgeContext
                    }
                ]);

                console.log('FINAL RESPONSE:', finalResponse);

                const finalMessage = finalResponse.output.find(
                    (item) => item.type === 'message'
                );

                const text = finalMessage
                    ? finalMessage.content[0].text
                    : 'No message returned from AI.';

                await conversationService.addMessageToConversation(
                    conversation._id,
                    text,
                    'assistant'
                );

                return res.status(200).json({
                    success: true,
                    conversationId: conversation._id,
                    data: text
                });
            }
        }

        // Handle normal AI response
        const aiMessage = response.output.find(
            (item) => item.type === 'message'
        );

        const text = aiMessage
            ? aiMessage.content[0].text
            : 'No message returned from AI.';

        await conversationService.addMessageToConversation(
            conversation._id,
            text,
            'assistant'
        );

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            data: text
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};