import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;

if(!streamApiKey || !streamApiSecret) {
  console.error('Stream API key or secret is missing ');
}


const streamClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

// todo: Generate a stream token for the user
export const generateStreamToken = (userId) => {}