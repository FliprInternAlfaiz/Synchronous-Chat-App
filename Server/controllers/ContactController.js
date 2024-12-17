import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const SearchContact = async (req, res, next) => {
  try {
    const { SearchTerm } = req.body;

    if (!SearchTerm) {
      return res.status(400).send("SearchTerm is required");
    }

    // Sanitize the search term by removing special characters
    const sanitizedSearchTerm = SearchTerm.replace(/[^a-zA-Z0-9]/g, "");


    // Check if userId is available
    if (!req.userId) {
      return res.status(400).send("User ID is not available");
    }

    // Create a regex pattern to match the sanitized search term, case-insensitive
    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Find users that do not match the current user's ID and match the regex in any of the specified fields
    const contacts = await User.find({
      _id: { $ne: req.userId }, // Exclude the current user
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    });

    if (contacts.length === 0) {
      return res.status(404).send("No contacts found");
    }

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("SearchContact Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getContactforDMList = async (req, res, next) => {
  try {
    let { userId } = req;

    userId = new mongoose.Types.ObjectId(userId);

    const contact = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
    ]);

    return res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contacts for DM list:", error);
    return res.status(500).send("Internal Server Error");
  }
};


