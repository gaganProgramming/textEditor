import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import serverless from 'serverless-http'; // For serverless compatibility

import Connection from './database/db.js'; // Your DB connection logic
import { getDocument, updateDocument } from './controller/document-controller.js'; // Document controller logic

dotenv.config(); // Load environment variables

// Replace this with your actual MongoDB connection string in .env
const URL = process.env.MONGODB_URI || `mongodb://users:codeforinterview@texteditor-shard-00-00.h6zcr.mongodb.net:27017,texteditor-shard-00-01.h6zcr.mongodb.net:27017,texteditor-shard-00-02.h6zcr.mongodb.net:27017/?ssl=true&replicaSet=atlas-lm758k-shard-0&authSource=admin&retryWrites=true&w=majority&appName=TextEditor`;

// Establish MongoDB connection
Connection(URL);

// Initialize express
const app = express();

// Serve the client build if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// Initialize HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer);

// Event handling for WebSocket connections
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle document request
    socket.on('get-document', async (documentId) => {
        const document = await getDocument(documentId);

        if (!document) {
            console.error(`Document with ID ${documentId} not found.`);
            return;
        }

        socket.join(documentId); // Join the document's room
        socket.emit('load-document', document.data); // Send initial document data to client

        // Listen for changes sent by the client
        socket.on('send-changes', (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta); // Broadcast changes
        });

        // Handle document save requests
        socket.on('save-document', async (data) => {
            try {
                await updateDocument(documentId, data);
                console.log(`Document ${documentId} saved successfully.`);
            } catch (error) {
                console.error(`Error saving document ${documentId}:`, error);
            }
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Wrap the express app with serverless-http for Vercel
export const handler = serverless(app);

// If running locally (not in production), start the server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 9000;
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
