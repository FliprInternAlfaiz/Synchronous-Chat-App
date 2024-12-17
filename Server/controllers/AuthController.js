import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs';


// Define the token expiration time in seconds
const maxAge = 3 * 24 * 60 * 60;

// Function to create a JWT token
const createToken = (email, userId) => {
  // The payload of the token should be an object
  const payload = { email, userId };

  // Generate a token using the payload, secret key, and options
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return response.status(400).send("Email and Password are required");
    }

    // Create a new user in the database
    const user = await User.create({ email, password });

    // Create a JWT token for the user
    const token = createToken(email, user.id);

    // Send the JWT token as a cookie to the user
    response.cookie("jwt", token, {
      maxAge: maxAge * 1000, // Convert maxAge to milliseconds for cookies
      httpOnly: true, // Use httpOnly to prevent client-side JavaScript from accessing the cookie
      secure: true, // Ensure the cookie is sent over HTTPS
      sameSite: "None", // Allow cross-site cookies
    });

    // Send a response with user details
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};


export const loign = async (request, response, next) => {
    try {
      const { email, password } = request.body;
  
      // Check if both email and password are provided
      if (!email || !password) {
        return response.status(400).send("Email and Password are required");
      }
  
      // Create a new user in the database
      const user = await User.findOne({ email });
      
      if (!user) {
        return response.status(400).send("User with Given email Not found");
      }

      const auth = await compare(password,user.password);
      if (!auth) {
        return response.status(400).send("Password is in Correct");
      }


      // Create a JWT token for the user
      const token = createToken(email, user.id);
  
      // Send the JWT token as a cookie to the user
      response.cookie("jwt", token, {
        maxAge: maxAge * 1000, // Convert maxAge to milliseconds for cookies
        httpOnly: true, // Use httpOnly to prevent client-side JavaScript from accessing the cookie
        secure: true, // Ensure the cookie is sent over HTTPS
        sameSite: "None", // Allow cross-site cookies
      });
  
      // Send a response with user details
      return response.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          profileSetUp: user.profileSetUp,
          firstName:user.firstName,
          lastName:user.lastName,
          image:user.image,
          color:user.color,
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };



  export const getuserinfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if(!userData){
            return response.status(404).send("User Not found with Given Id");
        }

        return response.status(200).json({
              id: userData.id,
              email: userData.email,
              profileSetUp: userData.profileSetUp,
              firstName:userData.firstName,
              lastName:userData.lastName,
              image:userData.image,
              color:userData.color,
          });
        
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };
  

  


  export const updateProfile = async (request, response, next) => {
    try {
      const { userId } = request;
      const { firstName, lastName, color } = request.body;
  
      if (!firstName || !lastName ) {
        return response.status(400).send("First name, last name, and color are required");
      }
  
      const userData = await User.findOneAndUpdate(
        { _id: userId },
        { firstName, lastName, color, profileSetUp: true },
        { new: true, runValidators: true }
      );
  
      if (!userData) {
        return response.status(404).send("User not found");
      }
  
      return response.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetUp: userData.profileSetUp,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };


  
  export const addProfileImage = async (request, response, next) => {
    try {
      // Check if a file is provided
      if (!request.file) {
        return response.status(400).send("File is required"); // Use 400 for client error
      }
  
      const date = Date.now();
  
      // Ensure the file name is constructed correctly
      let fileName = "uploads/profiles/" + date + "-" + request.file.originalname;
  
      // Rename the file
      renameSync(request.file.path, fileName);
  
      // Extract userId from request, assuming it's available (e.g., from session or token)
      const userId = request.userId; // Make sure to set this value correctly in your middleware
  
      // Update the user's profile image in the database
      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { image: fileName },
        { new: true, runValidators: true }
      );
  
      // Check if the user was found and updated
      if (!updateUser) {
        return response.status(404).send("User not found");
      }
  
      // Return the updated image path
      return response.status(200).json({
        image: updateUser.image,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };


  export const removeProfileImage = async (request, response, next) => {
    try {
     
      const userId = request.userId;

     const user= await User.findById(userId);

     if(!user){
      return response.status(404).send("User not Required");
     }

     if(user.image){
      unlinkSync(user.image);
     }

     user.image=null;
     user.save();


  
      return response.status(200).send("Profile image removed Sucessfully");
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };
  

  export const logout = async (request, response, next) => {
    try {
      // Clear the JWT cookie by setting its value to an empty string and making it expire immediately
      response.cookie("jwt", "", {
        maxAge: 1,               // Set the expiration to 1ms to ensure it's removed immediately
        httpOnly: true,          // Ensure the cookie is only accessible by the web server
        secure: true,            // Ensure the cookie is sent over HTTPS
        sameSite: "None",        // Allow cross-site cookie usage
      });
  
      return response.status(200).send("Logout Successfully");
    } catch (error) {
      console.error(error);
      return response.status(500).send("Internal Server Error");
    }
  };
  