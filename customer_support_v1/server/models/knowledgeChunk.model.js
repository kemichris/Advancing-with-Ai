import mongoose from 'mongoose';

const knowledgeChunkSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    },
    metadata: {
    source: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}
});

const KnowledgeChunk = mongoose.model('KnowledgeChunk', knowledgeChunkSchema);

export default KnowledgeChunk;