import mongoose from 'mongoose';

const Connection = async (URL) => {
  
    try {
        await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error while connecting to the database: ', error.message);
    }
};

export default Connection;
