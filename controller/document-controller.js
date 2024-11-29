import Document from '../schema/documentSchema.js';

// Function to retrieve or create a document by ID
export const getDocument = async (id) => {
    try {
        if (!id) {
            console.error('Invalid document ID provided');
            return null;
        }

        // Find document by ID
        let document = await Document.findById(id);

        // If not found, create a new document with the given ID
        if (!document) {
            document = new Document({ _id: id, data: '' });
            await document.save();
        }

        return document;
    } catch (error) {
        console.error(`Error in getDocument for ID ${id}:`, error);
        return null; // Return null in case of an error
    }
};

// Function to update a document by ID
export const updateDocument = async (id, data) => {
    try {
        if (!id || data === undefined) {
            console.error('Invalid ID or data provided for updateDocument');
            return null;
        }

        // Update document data
        const updatedDocument = await Document.findByIdAndUpdate(
            id,
            { data },
            { new: true } // Return the updated document
        );

        return updatedDocument;
    } catch (error) {
        console.error(`Error in updateDocument for ID ${id}:`, error);
        return null; // Return null in case of an error
    }
};
