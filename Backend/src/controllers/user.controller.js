import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try{
        const currentUserId = req.user.id;
        const currentUser= req.user;

        const recommendedUsers= await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude friends
                {isOnboarded: true} // Only include onboarded users

            ]
        });
        res.status(200).json({recommendedUsers});


    }catch(error) {
        console.error("Error in getRecommendedUser controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
}
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullname profilePicture learningLanguage nativeLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function sendFriendRequest(req, res) {
    try{const myId = req.user.id;
    const {id: recipientId} = req.params;

    if(myId === recipientId) {
        return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
    }

    //check if recipient is already a friend
    
    if(recipient.friends.includes(myId)) {
        return res.status(400).json({ message: "You are already friends with this user." });
    }

    const existingRequest= await FriendRequest.findOne({
        $or:[
            { sender: myId, recipient: recipientId },
            { sender: recipientId, recipient: myId },
        ]
    });

    if( existingRequest) {
        return res.status(400).json({ message: "Friend request already exists." });
    }

    const friedRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId,
    });

    res.status(201).json(friedRequest);



    }catch (error) {
        console.error("Error in sendFriendRequest controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id: requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Update friedn list of both users

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient } // Add current user to sender's friend list

        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender } // Add sender to current user's friend list
        });

        res.status(200).json({ message: "Friend request accepted successfully." });

    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getFriendRequests(req, res) {
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullname profilePicture learningLanguage nativeLanguage");

        const acceptedRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "accepted"
        }).populate("sender", "fullname profilePicture");

        res.status(200).json({
            incomingRequests,
            acceptedRequests
        });


    }catch (error) {
        console.error("Error in getFriendRequests controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullname profilePicture learningLanguage nativeLanguage");

        res.status(200).json(outgoingRequests);

    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}