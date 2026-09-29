import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';


import chatRoutes from './routes/chat.routes.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const addKnowledge = async () => {
//     try {
//         await createKnowledgeChunk(
//             'Domestic shipments within Nigeria usually arrive within 2–5 business days after dispatch. Delivery times can vary depending on the destination and unforeseen delays.',
//             {
//                 source: 'shipping-policy',
//                 category: 'domestic-shipping'
//             }
//         );

//         await createKnowledgeChunk(
//             'Customers can request a change to their delivery address before the shipment has been dispatched. Once a shipment is already in transit, the delivery address may not be changed.',
//             {
//                 source: 'shipping-policy',
//                 category: 'address-change'
//             }
//         );

//         await createKnowledgeChunk(
//             'If a shipment appears to be lost or has not received a tracking update for an extended period, customers should contact SwiftShip support with their tracking number so the support team can investigate the shipment.',
//             {
//                 source: 'shipping-policy',
//                 category: 'lost-shipment'
//             }
//         );

//         await createKnowledgeChunk(
//             'Customers who receive a damaged package should contact SwiftShip support as soon as possible and provide their tracking number along with photographs showing the damage to the package and its contents.',
//             {
//                 source: 'shipping-policy',
//                 category: 'damaged-shipment'
//             }
//         );

//         await createKnowledgeChunk(
//             'A shipment can be cancelled before it has been dispatched. Once the shipment has been dispatched and is in transit, cancellation may no longer be possible.',
//             {
//                 source: 'shipping-policy',
//                 category: 'shipment-cancellation'
//             }
//         );

//         console.log('Knowledge chunks created successfully');
//     } catch (error) {
//         console.error('Error adding knowledge:', error);
//     }
// };

// addKnowledge();