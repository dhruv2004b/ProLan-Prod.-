import { generateStreamToken } from "../utils/stream";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });
        
    } catch (error) {
        console.error("Error in getStreamToken controller:", error.message);
        resizeBy.status(500).json({ message: "Internal server error" });
    }
    
}