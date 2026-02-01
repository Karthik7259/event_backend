import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import sendEmail from "../service/sendEmail.js";

 const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}


// route for user login
const loginUser =async (req, res) => {
    // Logic for logging in a user


    try{
        const {email,password}=req.body;
 
        const user=await userModel.findOne({email:email});

        if(!user){
            return res.status(200).json({success:false,message:"User does not exist"});
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(200).json({success:false,message:"Incorrect password"});
        }

        const token=createToken(user._id);

        res.json({
            success:true,
            token:token,
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email
            }
        });


    }catch(error){
        console.log("Error in user login:",error);
        res.json({success:false,message:error.message})
    }
     
}

// route for user registration
const registerUser = async (req, res) => {
    // Logic for registering a user

   try{
          const {name,email,password}=req.body;

          const exists=await userModel.findOne({email:email});

            if(exists){
                return res.status(200).json({success:false,message:"User already exists"});
            }


            if (!validator.isEmail(email)) {
                return res.status(200).json({success:false,message:"Invalid email"});
            }

            if (password.length<8) {
                return res.status(200).json({success:false,message:"Password is not strong enough"});
            }
            // hahing user password
             const salt=await bcrypt.genSalt(10);
             const hashedPassword=await bcrypt.hash(password,salt);


             const newUser=new userModel({
                name:name,
                email:email,
                password:hashedPassword,
             });


             const user=await newUser.save();

             const token=createToken(user._id);

             res.json({
                success:true,
                token:token,
                user: {
                    _id: user._id,
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
             });

            }

          
   
   catch(error){    
    console.log("Error in user registration:",error);
    res.json({success:false,message:error.message})
   }
}

// Route for adminLogin
const adminLogin = async (req, res) => {
    // Logic for admin login


 try
 {

    const {email,password}=req.body;
    if(email!==process.env.admin_email || password!==process.env.admin_password){
        return  res.status(200).json({success:false,message:"Invalid admin credentials"});
    }

    const token=createToken(email); 
    res.json({success:true,token:token});

 }catch(error){
    console.log("Error in admin login:",error);
    res.json({success:false,message:error.message})
 }




}   

// Route for forgot password - Send OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash OTP and save to database
        user.resetPasswordOTP = crypto.createHash('sha256').update(otp).digest('hex');
        
        // Set OTP expire time (10 minutes)
        user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Email message with OTP - YourCampus branded template
        const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP - Gifts4Corp</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Gifts4Corp</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">Your Campus Gift Store</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: bold;">Password Reset Request</h2>
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                                Hello <strong>${user.name}</strong>,
                            </p>
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                                We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity and proceed with resetting your password:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                                <tr>
                                    <td style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
                                        <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: bold; letter-spacing: 2px;">YOUR OTP CODE</p>
                                        <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Info Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                                <tr>
                                    <td style="padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                                            <strong>⏱️ Important:</strong> This OTP will expire in <strong>10 minutes</strong> for security reasons.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                                If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
                            </p>
                            
                            <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.5;">
                                Best regards,<br>
                                <strong>The Gifts4Corp Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                                <strong>Contact Us</strong>
                            </p>
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">
                                📧 Email: <a href="mailto:sales@gifts4corp.com" style="color: #667eea; text-decoration: none;">sales@gifts4corp.com</a>
                            </p>
                            <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 13px;">
                                📱 Phone: <a href="tel:+919620044002" style="color: #667eea; text-decoration: none;">+91-9620044002</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                © 2025 Gifts4Corp. All rights reserved.<br>
                                Your Campus Gift Store - Making Every Moment Special
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        try {
            await sendEmail({
                sendTo: user.email,
                subject: '🔐 Password Reset OTP - Gifts4Corp',
                html: message
            });

            res.status(200).json({ success: true, message: 'OTP sent to your email' });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpires = undefined;
            await user.save();

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }

    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route for verifying OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        // Hash the OTP from request
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        // Find user by email and OTP
        const user = await userModel.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully' });

    } catch (error) {
        console.log("Error in verify OTP:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route for reset password after OTP verification
const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: 'Email, OTP and password are required' });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Hash the OTP from request
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        // Find user by email and OTP
        const user = await userModel.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });

    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser ,adminLogin, forgotPassword, verifyOTP, resetPassword };