import Conversation from "../models/conversation.model.js";


// Create a new conversation with the initial message
export const createConversation = async (message, role) => {
    const conversation = await Conversation.create({
        messages: [
            {
                content: message,
                role: role
            }
        ]
    });

    return conversation;
}

// get the conversation by ID
export const getConversationById = async (conversationId) => {
    const conversation = await Conversation.findById(conversationId);

    return conversation;
}

// Add a new message to an existing conversation
export const addMessageToConversation = async (conversationId, message, role) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error('Conversation not found');
    }

    conversation.messages.push({
        content: message,
        role: role
    });

    await conversation.save();

    return conversation;
}   