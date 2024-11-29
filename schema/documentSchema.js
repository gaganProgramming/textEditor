import mongoose from 'mongoose';

// Define the schema for a document
const documentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true, // The unique identifier for the document is mandatory
    },
    data: {
        type: Object, // Data is expected to be an object (e.g., Quill delta)
        required: true, // Ensures every document has data
        default: {}, // Provides an empty object as a default value
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model for the document schema
const Document = mongoose.model('Document', documentSchema);

export default Document;
