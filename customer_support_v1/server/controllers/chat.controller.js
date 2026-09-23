import { chatWithAI } from '../services/ai.service.js';
import { getShipmentStatus } from '../services/shipment.service.js';

export const chat = async (req, res) => {
    try {
        const { messages } = req.body;

        const response = await chatWithAI(messages);

        const toolCall = response.output.find(
            (item) => item.type === 'function_call'
        );

        if (toolCall) {
            const toolArguments = JSON.parse(toolCall.arguments);

            if (toolCall.name === 'get_shipment_status') {
                const shipment = await getShipmentStatus(
                    toolArguments.trackingNumber
                );

                console.log('SHIPMENT:', shipment);

                // Send the tool result back to the AI
                const finalResponse = await chatWithAI([
                    ...messages,
                    ...response.output,
                    {
                        type: 'function_call_output',
                        call_id: toolCall.call_id,
                        output: JSON.stringify(shipment)
                    }
                ]);

                return res.status(200).json({
                    success: true,
                    data: finalResponse.output
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: response.output
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};