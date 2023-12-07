import User from "../model/user";
import { signUpSchema, signInSchema } from "../schema/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/checkPermission";
import Cart from "../model/cart";
import dotenv from "dotenv";
import { UpdateUserReqBody } from "../model/requests/user.requrest";
import { Request, Response } from "express";
import HTTP_STATUS from "../constants/httpStatus";

dotenv.config();
export const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const { error } = signUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({
        message: "user already exits",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const cart = await Cart.create({
      user_id: user._id,
      products: [],
    });

    return res.json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = signInSchema.validate(
      { email, password },
      { abortEarly: false }
    );
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không khớp",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.ACCESSTOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refeshToken = jwt.sign(
      { _id: user._id },
      process.env.REFESHTOKEN_SECRET,
      { expiresIn: "2h" }
    );
    user.password = undefined;
    res.status(200).json({
      message: "Đăng nhập thành công",
      data: user,
      accessToken: token,
      refreshToken: refeshToken,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors[0] });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refeshToken = async (req, res) => {
  const result = await verifyToken(req.body.refreshToken);
  if (!result.status) {
    return res.status(401).json({
      message: result.message,
    });
  }
  const token = jwt.sign({ _id: result._id }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: "30d",
  });
  res.status(200).json({
    message: "Đăng nhập thành công",
    accessToken: token,
  });
};

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(200).json({
        message: "No have result",
      });
    }
    res.status(200).json({
      message: "Get All User Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error get user ",
    });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json({
      message: "Get user success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error get user",
    });
  }
};

export const addNewAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    const newAddress = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.address.length === 0) {
      newAddress.isDefault = true;
    } else {
      newAddress.isDefault = false;
    }
    // Thêm địa chỉ mới vào mảng
    user.address.push(newAddress);
    // Lưu trạng thái mới của người dùng
    await user.save();

    const resultAddress = user.address[user.address.length - 1];

    return res.status(200).json({
      message: "Add address success",
      data: resultAddress,
    });
  } catch (error) {
    return res.status(500);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const idAdress = req.params.addressId;
    const idUser = req.params.userId;
    const updateAddressData = req.body;
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const addressIndex = user.address.findIndex(
      (address) => address.id == idAdress
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        error: "Address not found",
      });
    }

    // user.address[addressIndex].city = updateAddressData.city;
    // user.address[addressIndex].district = updateAddressData.district;
    // user.address[addressIndex].wards = updateAddressData.wards;
    // user.address[addressIndex].detailAdress = updateAddressData.detailAdress;
    if (
      "isDefault" in updateAddressData &&
      updateAddressData.isDefault === true
    ) {
      user.address.forEach((address) => {
        address.isDefault = false;
      });
      updateAddressData.isDefault = true;
      user.address[addressIndex].isDefault = updateAddressData.isDefault;
    }

    await user.save();
    return res.status(200).json({
      message: "Update address success",
      data: user.address,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const idAdress = req.params.addressId;
    const idUser = req.params.userId;
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const addressIndex = user.address.findIndex(
      (address) => address.id == idAdress
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        error: "Address not found",
      });
    }

    if(user.address[addressIndex].isDefault && user.address.length >= 2){
      console.log("1 >>>>")
      if(addressIndex === 0) {
        user.address[addressIndex + 1].isDefault = true
      } else {
        user.address[0].isDefault = true
      }
    }

    user.address.splice(addressIndex, 1);

    await user.save();

    return res.status(200).json({
      message: "Delete address success",
      data: user.address,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const updateUser = async (
  req: Request<{ id: string }, any, UpdateUserReqBody>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    // {new:true} de cap nhat ban gi tra ve
    const userUpdated = await User.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    res.status(HTTP_STATUS.OK).json({
      message: "Cập nhật người dùng thành công",
      data: userUpdated,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

export const getUserAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById({ _id: id }).select("address");
    if (!user) {
      return res.json({
        message: "User không tồn tại",
      });
    }

    return res.json({
      message: "Thành công",
      results: user.address,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
