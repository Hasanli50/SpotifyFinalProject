const transporter = require("../config/nodemailer.js");
const User = require("../models/user.js");
const formatObj = require("../utils/formatObj.js");
const path = require("path");
const bcrypt = require("bcrypt");
const extractPublicId = require("../utils/extractPublicId.js");
const { cloudinary } = require("../config/imageCloudinary.js");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const cron = require("node-cron");

const getAllNonDeletedUsers = async (_, res) => {
  try {
    const users = await User.find({ isDeleted: false }, { password: 0 });
    if (users.length === 0) {
      return res.status(404).json({
        message: "Users not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Users successfully found",
      status: "success",
      data: users.map(formatObj),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const getAllDeletedUsers = async (_, res) => {
  try {
    const users = await User.find({ isDeleted: true }, { password: 0 });
    if (users.length === 0) {
      return res.status(404).json({
        message: "No deleted users found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Deleted users successfully found",
      status: "success",
      data: users.map(formatObj),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { isDeleted: false }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "User successfully found",
      status: "success",
      data: formatObj(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const getByToken = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById({ _id: id, isDeleted: false });
    // .select("-password")
    // .populate("genreIds");
    // .populate("trackIds")
    // .populate("albumIds");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      status: "success",
      data: formatObj(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const duplicate = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Username or email already exists!",
        status: "fail",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: "user",
      image: req.file.path,
      isBanned: false,
      isFrozen: false,
      banExpiresAt: null,
      isDeleted: false,
    });

    await newUser.save();

    const token = newUser.generateToken();
    //send mail with nodemailer
    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Account Verification | Melodies",
        html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(90deg,
                rgba(238, 16, 176, 1) 12%,
                rgba(14, 158, 239, 1) 100%);
              color: white;
              text-align: center;
              padding: 15px 0;
              border-radius: 5px 5px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background-color: white;
              padding: 25px;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .content p {
              font-size: 16px;
              color: #333;
              line-height: 1.6;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(
                90deg,
                rgba(238, 16, 176, 1) 12%,
                rgba(14, 158, 239, 1) 100%
              );
              color: white;
              padding: 15px 50px;
              font-size: 20px;
              text-decoration: none;
              text-transform: capitalize;
              font-weight: 500;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s ease-in-out;
              margin-top: 20px;
              text-align: center;
            }
            .cta-button:hover {
              opacity: 0.9;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Melodies!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up with Melodies! We're excited to have you on board.</p>
              <p>To complete your registration and verify your account, please click the button below:</p>
              <a href="${process.env.APP_BASE_URL}/verify/${token}" class="cta-button">Verify My Account</a>
            </div>
            <div class="footer">
              <p>If you did not sign up for Melodies, you can ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    res.status(201).json({
      message: "User registered successfully. Please verify your email!",
      status: "success",
      data: {
        id: formatObj(newUser).id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        image: req.file.path,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.login(username, password);
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
        status: "fail",
      });
    }
    if (user.isVerified === false) {
      return res.status(401).json({
        message: "Please verify your account",
        status: "fail",
      });
    }

    //check if ban is expired
    if (user.banExpiresAt < Date.now()) {
      await User.findByIdAndUpdate(user._id, {
        isBanned: false,
        banExpiresAt: null,
      });
    }
    if (user.isBanned === true) {
      const remainingMilliseconds = user.banExpiresAt - Date.now();
      const remainingMinutes = Math.floor(remainingMilliseconds / (1000 * 60));
      const remainingSeconds = Math.floor(
        (remainingMilliseconds % (1000 * 60)) / 1000
      );
      return res.status(401).json({
        message: `Your account is banned. Come back after ${remainingMinutes} minutes and ${remainingSeconds} seconds.`,
        status: "fail",
      });
    }
    //check if frozen - unfreeze in login
    if (user.isFrozen === true) {
      await User.findByIdAndUpdate(
        user._id,
        { isFrozen: false },
        { new: true }
      );
    }

    res.status(200).json({
      data: {
        id: formatObj(user).id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: user.generateToken(), // generate token
      message: "User logged in successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const { id } = User.decodeToken(token);

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        status: "fail",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { isVerified: true });
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    if (updatedUser.isVerified === true) {
      return res.status(400).json({
        message: "Account already verified",
        status: "fail",
      });
    }

    res.status(200).json({
      data: {
        id: formatObj(updatedUser).id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
      message: "Account verified successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    if (user.image) {
      const publicId = extractPublicId(user);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        email: null,
        username: null,
        image: null,
      },
      { new: true }
    );

    res.status(200).json({
      data: formatObj(updatedUser),
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const freezeAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isFrozen: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(user),
      message: "User frozen successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const unfreezeAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isFrozen: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: user,
      message: "User unfrozen successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const banAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body; // in minutes

    const banExpiresAt = new Date(Date.now() + duration * 60 * 1000);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      {
        isBanned: true,
        banExpiresAt: banExpiresAt,
      },
      { new: true }
    );

    return res.status(200).json({
      data: formatObj(updated),
      message: `User banned for ${duration} minutes`,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const unBanAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBanned: false,
        banExpiresAt: null,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(user),
      message: "User unbanned successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const sentUser = {
      ...req.body,
    };

    if (req.file) {
      sentUser.image = req.file.path;
    }

    const prevUser = await User.findById(id);

    if (!prevUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, sentUser, {
      new: true,
      runValidators: true,
    });

    if (req.file) {
      const publicId = extractPublicId(prevUser);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    return res.status(200).json({
      data: formatObj(updatedUser),
      message: "User updated successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        status: "fail",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
        status: "fail",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    return res.status(200).json({
      message: "Password updated successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

//send email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await User.find({ email: email, isDeleted: false });
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const token = user.generateToken();

    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset | Melodies",
        html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            padding: 10px;
          }
          .header {
            background: linear-gradient(90deg,
              rgba(238, 16, 176, 1) 12%,
              rgba(14, 158, 239, 1) 100%);
            color: white;
            text-align: center;
            padding: 15px 0;
            border-radius: 5px 5px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background-color: #f4f7fa;
            padding: 25px;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .content p {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
          }
            .cta-button {
            display: inline-block;
            background: linear-gradient(90deg,
              rgba(238, 16, 176, 1) 12%,
              rgba(14, 158, 239, 1) 100%);
            color: white;
            padding: 15px 25px;
            font-size: 20px;
            text-decoration: none;
            text-transform: capitalize;
            font-weight: 500;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            margin-top: 20px;
            text-align: center;
            }
          .cta-button:hover {
            opacity: 0.9;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset the password for your Melodies account. If you made this request, you can reset your password by clicking the button below:</p>
            <a href="${process.env.APP_BASE_URL}/reset-password/${token}" class="cta-button">Reset My Password</a>
          </div>
          <div class="footer">
            <p>If you did not sign up for Melodies, you can ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
    `,
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    return res.status(200).json({
      message: "Password reset link sent to your email",
      status: "success",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { id } = req.user;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        status: "fail",
      });
    }
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        status: "fail",
      });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Both password and confirmPassword are required",
        status: "fail",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: await bcrypt.hash(password, 10),
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      data: updatedUser,
      id: id,
      message: "Password reset successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const payment = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById({ _id: id, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isPremium: true,
        premiumSince: new Date(),
      },
      { new: true }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
    });

    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: updatedUser.email,
        subject: "Payment | Melodies",
        html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            padding: 10px;
          }
          .header {
            background: linear-gradient(90deg,
              rgba(238, 16, 176, 1) 12%,
              rgba(14, 158, 239, 1) 100%);
            color: white;
            text-align: center;
            padding: 15px 0;
            border-radius: 5px 5px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background-color: #fff;
            padding: 25px;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .content p {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
          }
            .cta-button {
              display: inline-block;
              background: linear-gradient(90deg,
                  rgba(238, 16, 176, 1) 12%,
                  rgba(14, 158, 239, 1) 100%);
              color: white;
              padding: 15px 25px;
              font-size: 20px;
              text-decoration: none;
              text-transform: capitalize;
              font-weight: 500;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s ease-in-out;
              margin-top: 20px;
              text-align: center;
            }
          .cta-button:hover {
           opacity: 0.9;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmation</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received your payment of <strong>$5</strong> for your Melodies subscription. Thank you for supporting us!</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact us at support@melodies.com</p>
          </div>
        </div>
      </body>
    </html>
    `,
      })
      .catch((error) => {
        console.log("Error sending email:", error);
      });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
};

const updatePremiumStatus = async () => {
  try {
    const users = await User.find({
      isPremium: true,
      isDeleted: false,
    });

    const currentDate = new Date();

    for (const user of users) {
      const premiumExpirationDate = new Date(user.premiumSince);
      premiumExpirationDate.setMonth(premiumExpirationDate.getMonth() + 1);

      if (currentDate > premiumExpirationDate) {
        await User.findByIdAndUpdate(user._id, {
          isPremium: false,
          premiumSince: null,
        });

        await transporter
          .sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Your Premium Subscription has Expired, | Melodies",
            html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(90deg,
                rgba(238, 16, 176, 1) 12%,
                rgba(14, 158, 239, 1) 100%);
              color: white;
              text-align: center;
              padding: 15px 0;
              border-radius: 5px 5px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background-color: white;
              padding: 25px;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .content p {
              font-size: 16px;
              color: #333;
              line-height: 1.6;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(
                90deg,
                rgba(238, 16, 176, 1) 12%,
                rgba(14, 158, 239, 1) 100%
              );
              color: white;
              padding: 15px 50px;
              font-size: 20px;
              text-decoration: none;
              text-transform: capitalize;
              font-weight: 500;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s ease-in-out;
              margin-top: 20px;
              text-align: center;
            }
            .cta-button:hover {
              opacity: 0.9;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Subscription Expired</h1>
            </div>
            <div class="content"> 
              <p>Hello, ${user.username},</p>
              <p>We wanted to inform you that your premium subscription to Melodies has expired.</p>
              <p>If you wish to continue enjoying premium features, feel free to subscribe again.</p>
              <p>Thank you for being a valued user of Melodies!</p>
            </div>
            <div class="footer">
              <p>If you did not sign up for Melodies, you can ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
          })
          .catch((error) => {
            console.log("error: ", error);
          });
        console.log(`User ${user._id} premium status updated.`);
      }
    }

    console.log("Premium statuses updated.");
  } catch (error) {
    console.error("Error updating premium statuses:", error);
  }
};

cron.schedule("* * * * *", updatePremiumStatus);

module.exports = {
  getAllNonDeletedUsers,
  getAllDeletedUsers,
  getById,
  getByToken,
  register,
  login,
  verifyAccount,
  deleteAccount,
  freezeAccount,
  unfreezeAccount,
  banAccount,
  unBanAccount,
  resetPassword,
  forgotPassword,
  updatePassword,
  updateUserInfo,
  payment,
};
