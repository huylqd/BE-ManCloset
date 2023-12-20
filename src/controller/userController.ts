import User from "../model/user";
import { signUpSchema, signInSchema, userSchema } from "../schema/userSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { verifyRefreshToken, verifyToken } from "../middleware/checkPermission";
import Cart from "../model/cart";
import dotenv from "dotenv";
import { UpdateUserReqBody } from "../model/requests/user.requrest";
import { Request, Response } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import cloudinary from "../config/cloudinary";
import crypto from "crypto-js";
import { checkInteger } from "../utils/checkNumber";
import { dataQueryPaginate } from "../utils/dataQuery";
import { sendMailClose, sendMailForgotPassword, sendMailOpen, sendMailPassword } from "../utils/sendMail";
import { generateRandomString } from "../utils/random";
dotenv.config()

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

    const { error } = signInSchema.validate({ email, password }, { abortEarly: false })
    if (error) {
      const errors = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errors
      })
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" })
    }
    if (user.isBlocked) {
      return res.status(400).json({ message: "Tài khoản tạm thời bị khóa" })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không khớp"
      })
    }
    const token = jwt.sign({ _id: user._id }, process.env.ACCESSTOKEN_SECRET, { expiresIn: "1h" })
    const refeshToken = jwt.sign({ _id: user._id }, process.env.REFESHTOKEN_SECRET, { expiresIn: "2h" })

    // res.send('success') 
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      path: "/",
      // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
      sameSite: "strict"
    })
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
}
export const refeshToken = async (req, res) => {
  const result = await verifyRefreshToken(req.body.refreshToken)


  if (!result.status) {
    return res.status(401).json({
      message: result.message
    });
  }
  const token = jwt.sign({ _id: result.payload._id }, process.env.ACCESSTOKEN_SECRET, { expiresIn: "30d" })
  res.status(200).json({
    message: "Đăng nhập thành công",
    data: token,
  })
}

export const getAllUser = async (req, res) => {
  const {
    _page = 1,
    _limit = _page == 0 ? 10000000 : 5,
    _sort = "role,createdAt",
    _order = "asc",
    _expand,
    _keywords,
  } = req.query;
  const sortFields = _sort.split(',');
  const sortObject = {};
  sortFields.forEach((field) => {
    sortObject[field.trim()] = _order === "desc" ? -1 : 1;
  });

  const options: any = {
    page: _page,
    limit: _limit,
    sort: sortObject,
  };
  try {


    const user = await User.paginate({}, options)
    if (user.length === 0) {
      res.status(200).json({
        message: "No have result"
      })
    }

    res.status(200).json({
      message: "Get All User Successfully",
      data: user.docs,
      paginate: {
        currentPage: user.page,
        totalPages: user.totalPages,
        totalItems: user.totalDocs,
        limit: user.limit
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error get user "
    })

  }
}

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

    if (user.address[addressIndex].isDefault && user.address.length >= 2) {
      console.log("1 >>>>")
      if (addressIndex === 0) {
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
}

export const getAllContact = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    const contacts = await User.find({
      _id: {
        $ne: req.params.id
      }
    }).select([
      'email',
      'name',
      'avatar',
      '_id'
    ])

    if (!contacts) {
      return res.status(400).json({
        message: 'Get contacts fail'
      })
    }
    return res.status(200).json(contacts)
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error,
    });
  }
}

export const deleteUser = async (req, res) => {
}

export const lockUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      console.log("error", error);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { userId } = req.params

    const lockByUser = await User.findById(userId);
    if (!lockByUser) {
      res.status(404).json({
        message: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: lockByUser.isBlocked ? false : true },
      { new: true }
    )
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }
    if (user.isBlocked) {
      sendMailOpen(user.name, user.email)
      return res.status(200).json({
        message: "Khóa người dùng thành công",
        data: user
      })
    }
    sendMailClose(user.name, user.email)
    return res.status(200).json({
      message: "Mở khóa người dùng thành công",
      data: user
    })


  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

export const getWishListByUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        message: "User không tồn tại"
      })
    } else {
      res.status(200).json({
        message: "Danh sách yêu thích",
        wishList: user.wishList
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}
export const addRemoveWishLish = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(404).json({
        message: "Bạn cần đăng nhập để thực hiện chức năng này"
      })
    }
    const itemToAdd = req.body;
    console.log(itemToAdd);
    console.log(user);
    const { _id } = req.body;
    if (_id) {
      user.wishList = user.wishList.filter(item => item._id.toString() !== _id.toString());
      // Lưu người dùng với danh sách yêu thích đã được cập nhật
      const updatedUser = await user.save();
      res.status(200).json({
        message: 'Xóa danh sách yêu thích thành công',
        wishList: updatedUser
      })
    } else {
      const existingItem = user.wishList.find(item => item.name === itemToAdd.name);
      if (existingItem) {
        res.status(404).json({
          message: 'Đã tồn tại trong danh sách yêu thích'
        })
      } else {
        user.wishList.push(itemToAdd);
        const addWishList = await user.save();
        res.status(200).json({
          message: "Thêm danh sách yêu thích thành công",
          wishList: addWishList
        })
      }

    }
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

export const removeWishList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { _id } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Người dùng không tồn tại'
      });
    }
    user.wishList = user.wishList.filter(item => item._id.toString() !== _id.toString());
    //   console.log(user.wishList);

    // Lưu người dùng với danh sách yêu thích đã được cập nhật
    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Xóa danh sách yêu thích thành công',
      wishList: updatedUser
    })

  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}
export const updateAvatar = async (req, res) => {
  try {
    const { userId } = req.params
    const fileImages = req.files;
    if (!fileImages || fileImages.length === 0) {
      return res.status(400).json({
        error: 'Vui lòng tải lên ít nhất một hình ảnh sản phẩm',
      });
    }
    const user = await User.findById(userId);
    const oldImagePath = user.avatar;
    const imagePath = fileImages[0].path;
    console.log(oldImagePath);

    if (!oldImagePath || oldImagePath.length === 0) {
      await User.findByIdAndUpdate(
        { _id: userId },
        { avatar: imagePath },
        { new: true })
      return res.status(200).json({
        message: "Update avatar 111 user thành công",
        user
      })
    } else {
      const publicId = oldImagePath.split('/').slice(-2).join('/').split('.')[0]; // Lấy public_id từ đường dẫn 
      await cloudinary.uploader.destroy(publicId);
      await User.findByIdAndUpdate(
        { _id: userId },
        { avatar: imagePath },
        { new: true }
      )
      return res.status(200).json({
        message: "Update avatar 222 user thành công",
        user
      })
    }




  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

// Chuyển người dùng vào trong thùng rác
export const removeUserToTrash = async (req,res) => {
  try {
     const id = req.params.id
    const user = await User.findById(id)
  
    if(!user) {
      return res.status(400).json({
        message: "Không tìm thấy người dùng",
    })
    }
    if(user && user.role === "admin"){
      return res.status(400).json({
        message: "Tài khoản admin không thể bị xóa",
    })
    }
    if (user) {
      await (user as any).delete()
  }
    return res.status(200).json({
      message: "Chuyển người dùng vào ",
      data:user
  })
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}
export const getAllDeletedUser = async (req,res) => {
  try {
    const query = req.query;
    const options = {
      page: checkInteger(+query?.page) ? +query.page - 1 : 0,
      limit: checkInteger(+query?.limit) ? +query.limit : 10,
      sort: query.sort || "createdAt",
      order: query.order || "desc",
    };
    const totalUser = await (User as any).findWithDeleted({ deleted: true });
    const totalPages = Math.ceil(totalUser.length / options.limit);
    const user = await (User as any).findWithDeleted({ deleted:true}).sort({
      [options.sort as string]: options.order as string,
    }).skip((options.page) * options.limit  ).limit(options.limit as number);
    const result = dataQueryPaginate(totalUser,user,+options.limit, +options.page,totalPages)
    return res.status(200).json({
      message: "Tất cả người dùng",
      data:result,  
  });
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}
export const restoreUser = async (req,res) => {
  try {
    const restoredUser = await (User as any).restore({ _id: req.params.id }, { new: true });
      if (!restoredUser) {
          return res.status(400).json({
              message: "Danh mục không tồn tại hoặc đã được khôi phục trước đó.",
          });
      }

      return res.status(200).json({
          message: "Khôi phục danh mục thành công.",
          data: restoredUser,
      });
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}



// Lấy tất cả người dùng trong thùng rác



export const forgotPassword = async (req, res) => {
  try {
      const email = req.body.email
      
      if (!email) {
          return res.status(400).json({
              message: "Không có email!"
          })
      }
      const user = await User.findOne({ email: email })
      if (!user) {
          return res.status(404).json({
              message: "Không tìm thấy người dùng"
          })
      }
      const resetToken = crypto.lib.WordArray.random(32).toString();
      user.passwordResetToken = crypto.SHA256(resetToken, process.env.ACCESSTOKEN_SECRET).toString();
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      await user.save()
      await sendMailForgotPassword(user.name,email,resetToken)
      return res.status(200).json({
        message:"Gửi mail thành công",
        resetToken:resetToken
      })
      
  } catch (error) {
      return res.status(400).json({
          message: error.message
      })
  }
}


export const resetPassword = async (req, res) => {
  try {
      const hashedToken = crypto.SHA256(req.params.token, process.env.ACCESSTOKEN_SECRET).toString();
      const user = await User.findOne({
          passwordResetToken: hashedToken,
          passwordResetExpires: { $gt: Date.now() }
      })
      if (!user) {
          return res.status(400).json({
              message: "Token reset password hết hạn"
          })
      }
      // const newPassword = generateRandomString(6)
      const handlePass = await bcrypt.hash(req.body.password, 10);
      user.password = handlePass;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.passwordChangeAt = Date.now();
      await user.save();
      // const token = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRET, {
      //     expiresIn: "1d"
      // })
      await sendMailPassword(user.name,user.email,req.body.password)
      return res.status(200).json({
          message: "Mật khẩu mới được cập nhật",
          // token
      })
  } catch (error) {
      return res.status(400).json({
          message: error.message
      })
  }
}
