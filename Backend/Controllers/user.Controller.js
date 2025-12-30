const userSchema = require("../Models/user.Schema");
const bcrypt = require("bcryptjs");

async function getUserProfile(req, res) {
    try {
        const user = await userSchema.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", user: user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}

async function updateUserProfile(req, res) {
    try {
        //firest verification
        const { Fullname, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await userSchema.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // now upate the fileds 
        user.Fullname = Fullname || user.Fullname;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}

async function ChangePassword(req, res) {
    try {
        const { oldpassword, newpassword } = req.body;
        if (!oldpassword || !newpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userSchema.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const ismatch = await bcrypt.compare(oldpassword, user.password);
        if (!ismatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const issame = await bcrypt.compare(newpassword, user.password);
        if (issame) {
            return res.status(400).json({ message: "New password cannot be same as old password" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}

module.exports = { getUserProfile, updateUserProfile, ChangePassword };
