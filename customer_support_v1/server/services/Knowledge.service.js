import Knowledge from '../models/knowledgeChunk.model.js';
import { createEmbedding } from './ai.service.js';


export const searchKnowledge = async (question) => {
    const embedding = await createEmbedding(question);

    const results = await Knowledge.aggregate([
        {
            $vectorSearch: {
                index: 'knowledge_chunk_vector_index',
                path: 'embedding',
                queryVector: embedding,
                numCandidates: 100,
                limit: 5
            }
        }
    ]);

    return {
        results: results.map((result) => ({
            content: result.content,
            metadata: result.metadata
        }))
    };
};


export const buildContext = (result) => {
    const context = result.results.map((item) => {
        return `Content: ${item.content}\nSource: ${item.metadata.source}\nCategory: ${item.metadata.category}`;
    }).join('\n\n');

    return context; 
}


export const getKnowledge = async (question) => {
    const searchResults = await searchKnowledge(question);
    const context = buildContext(searchResults);

    return context;
}