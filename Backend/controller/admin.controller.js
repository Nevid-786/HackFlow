import User from "../models/user.js";
import TRY_CATCH from "../utils/TRY_CATCH.js";

// GET /admin/users/pending
export const getPendingUsers = TRY_CATCH(async (req, res, next) => {
    const pendingUsers = await User.find({ status: 'pending' }).sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Got pending signup requests",
        users: pendingUsers,
    });
});

// GET /admin/users  (all approved members)
export const getAllMembers = TRY_CATCH(async (req, res, next) => {
    const users = await User.find({ status: 'approved' }).sort({ name: 1 });

    return res.status(200).json({
        message: "Got all members",
        users,
    });
});

// PATCH /admin/users/:id/approve
export const approveUser = TRY_CATCH(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== 'pending') {
        return res.status(400).json({ message: `User is already ${user.status}` });
    }

    user.status = 'approved';
    await user.save();

    return res.status(200).json({
        message: "User approved",
        user,
    });
});

// PATCH /admin/users/:id/reject
export const rejectUser = TRY_CATCH(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== 'pending') {
        return res.status(400).json({ message: `User is already ${user.status}` });
    }

    user.status = 'rejected';
    await user.save();

    return res.status(200).json({
        message: "User rejected",
        user,
    });
});