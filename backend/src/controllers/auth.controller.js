const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlackListModel=require("../models/blacklist.model")



const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


async function userLogoutController(req,res){
    const token=req.cookies.token||req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(200).json({
            message:"User logged out successfully"
        })
    }
        
        await tokenBlackListModel.create({
            token:token
        })
        res.clearCookie("token")

        res.status(200).json({
            message:"User logged out successfully"
        })
}

async function getProfileController(
  req,
  res
) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

async function adminDashboardController(
  req,
  res
) {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
  });
}

async function updateProfileController(
  req,
  res
) {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function changePasswordController(
  req,
  res
) {
  try {
    const { oldPassword, newPassword } =
      req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Old password and new password are required",
      });
    }

    const user = await User.findById(
      req.user._id
    ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllUsersController(
  req,
  res
) {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
}

async function updateUserRoleController(
  req,
  res
) {
  const { role } = req.body;

  const user =
    await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

  res.status(200).json({
    success: true,
    user,
  });
}
module.exports = {registerUser,
     loginUser,
      getProfileController,
       adminDashboardController,
       userLogoutController,
       updateProfileController,
       changePasswordController,
       getAllUsersController,
       updateUserRoleController
    };