import User from "../model/user";
import { signUpSchema, signInSchema, userSchema } from "../schema/userSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { verifyRefreshToken, verifyToken } from "../middleware/checkPermission";
import Cart from "../model/cart";
import dotenv from 'dotenv'

dotenv.config()

export const signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const { error } = signUpSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const userExits = await User.findOne({ email })
        if (userExits) {
            return res.status(400).json({
                message: "user already exits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

            const cart = await Cart.create({
                user_id:user._id,
                products:[]
            })

        return res.json({
            message: "User created successfully",
            user: user
        })

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body

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
        const token = jwt.sign({ _id: user._id }, process.env.ACCESSTOKEN_SECRET , { expiresIn: "15s" })
        const refeshToken = jwt.sign({ _id: user._id }, process.env.REFESHTOKEN_SECRET , { expiresIn: "2h" })
     
        // res.send('success') 
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
    console.log(result);
    
    if (!result.status) {
        return res.status(401).json({
            message: result.message
        });
    }
    const token = jwt.sign({ _id: result.payload._id }, process.env.ACCESSTOKEN_SECRET , { expiresIn: "30d" })
    res.status(200).json({
        message: "Đăng nhập thành công",
        data: token,
    });
}

export const getAllUser = async (req, res) => {
    const {
        _page = 1,
        _limit = _page == 0 ? 10000000 : 5,
        _sort = "role",
        _order = "asc",
        _expand,
        _keywords,
      } = req.query;
      const options: any = {
        page: _page,
        limit: _limit,
        sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
      };
    try {
        
        
        const user = await User.paginate({},options)
        if (user.length === 0) {
            res.status(200).json({
                message: "No have result"
            })
        }
        
        res.status(200).json({
            message: "Get All User Successfully",
            data: user.docs,
            paginate :{
                currentPage: user.page,
                totalPages: user.totalPages,
                totalItems: user.totalDocs,
                limit:user.limit
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
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({
                message: "user not found"
            })
        }
        res.status(200).json({
            message: "Get user success",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error get user",
        });
    }
}

export const addNewAddess = async (req, res) => {
    try {
        const userId = req.params.id;
        const newAddress = req.body;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        const isFirstAddress = user.address.length === 0;
        if (isFirstAddress) {
            newAddress.isDefault = isFirstAddress
        }
        else if ('isDefault' in newAddress && newAddress.isDefault === true) {
            user.address.forEach(address => {
                address.isDefault = false;
            });
            newAddress.isDefault = true;
        }
        // Thêm địa chỉ mới vào mảng
        user.address.push(newAddress);

        // Lưu trạng thái mới của người dùng
        await user.save();

        return res.status(200).json({
            message: 'Add address success',
            data: user.address
        });
    } catch (error) {
        return res.status(500)
    }
}


export const updateAddress = async (req, res) => {
    try {
        const idAdress = req.params.addressId;
        const idUser = req.params.userId
        const updateAddressData = req.body
        const user = await User.findById(idUser)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }
        const addressIndex = user.address.findIndex(address => address.id == idAdress);

        if (addressIndex === -1) {
            return res.status(404).json({
                error: 'Address not found',
            });
        }

        user.address[addressIndex].city = updateAddressData.city;
        user.address[addressIndex].district = updateAddressData.district;
        user.address[addressIndex].wards = updateAddressData.wards;
        user.address[addressIndex].detailAdress = updateAddressData.detailAdress;
        if ('isDefault' in updateAddressData && updateAddressData.isDefault === true) {
            user.address.forEach(address => {
                address.isDefault = false;
            });
            updateAddressData.isDefault = true;
            user.address[addressIndex].isDefault = updateAddressData.isDefault;
        }

        await user.save();
        return res.status(200).json({
            message: 'Update address success',
            data: user.address,
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
        })
    }

}

export const deleteAddress = async (req, res) => {
    try {
        const idAdress = req.params.addressId;
        const idUser = req.params.userId;
        const user = await User.findById(idUser)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }
        const addressIndex = user.address.findIndex(address => address.id == idAdress);

        if (addressIndex === -1) {
            return res.status(404).json({
                error: 'Address not found',
            });
        }
        user.address.splice(addressIndex, 1);

        await user.save()

        return res.status(200).json({
            message: 'Delete address success',
            data: user.address,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
        })
    }
}


export const updateUser = async (req:any,res:any) => {
    try {
        const { id } = req.params;
        const { address} = req.body;
        // Tạo đối tượng chứa các trường được cập nhật trong user
        let updatedFields = {};
        if (address && Array.isArray(address)) {
            // Tìm vị trí của địa chỉ cần cập nhật trong mảng address
            const addressIndex = address.findIndex((item) => item._id);
            if (addressIndex !== -1) {
              // Cập nhật từng trường của địa chỉ cần cập nhật
              Object.keys(address[addressIndex]).forEach((key) => {
                updatedFields[`address.${addressIndex}.${key}`] = address[addressIndex][key];
              });
            }else{
                updatedFields = req.body;
            }
          }
      
          // Thực hiện cập nhật
          const user = await User.findByIdAndUpdate(
            id,
            updatedFields ,
            { new: true }
          );
        // console.log("category:", category);
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        }
        res.status(200).json({
          message: "User update successfully",
          data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: error
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
        const {userId} = req.params
   
        const lockByUser = await User.findById(userId);
        if(!lockByUser){
            res.status(404).json({
                message: "User not found",
              });
            }
        
        const user = await User.findByIdAndUpdate(
            userId,
             { isBlocked: lockByUser.isBlocked ? false : true } ,
            { new: true } 
        )
        if (!user) {
            res.status(404).json({
              message: "User not found",    
            });
          }
          res.status(200).json({
            message:"Khóa người dùng thành công",
            data:user
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
        if(!user){
             res.status(404).json({
                message:"User không tồn tại"
            })
        }else{
             res.status(200).json({
                message:"Danh sách yêu thích",
                wishList:user.wishList
            })
        }
    } catch (error) {
        return    res.status(500).json({
        message:error
       })
    }
   }
   export const addRemoveWishLish = async (req, res) => {
    try {
        const user = req.user
        if(!user){
            return res.status(404).json({
                message:"Bạn cần đăng nhập để thực hiện chức năng này"
            })
        }
        const itemToAdd = req.body;
        console.log(itemToAdd);
        console.log(user);
        const  {_id}  = req.body;
            if(_id){
                user.wishList = user.wishList.filter(item =>item._id.toString() !== _id.toString());
                // Lưu người dùng với danh sách yêu thích đã được cập nhật
                const updatedUser = await user.save();
                res.status(200).json({
                    message: 'Xóa danh sách yêu thích thành công',
                    wishList: updatedUser
                })
            }else{
                const existingItem = user.wishList.find(item => item.name === itemToAdd.name);
                if(existingItem){
                    res.status(404).json({
                        message: 'Đã tồn tại trong danh sách yêu thích'
                    })
                }else{
                    user.wishList.push(itemToAdd);
                    const addWishList = await user.save();
                    res.status(200).json({
                        message: "Thêm danh sách yêu thích thành công",
                        wishList:addWishList
                    })
                }
             
            }
           
        
       
    
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
   }

   export const removeWishList = async (req, res) => {
    try {
        const userId = req.params.userId;
        const  {_id}  = req.body;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({
              message: 'Người dùng không tồn tại'
          });
      }
      user.wishList = user.wishList.filter(item =>item._id.toString() !== _id.toString());
    //   console.log(user.wishList);
      
      // Lưu người dùng với danh sách yêu thích đã được cập nhật
      const updatedUser = await user.save();
   
      
    
        res.status(200).json({
            message: 'Xóa danh sách yêu thích thành công',
            wishList: updatedUser
        })
        
    } catch (error) {
        
    }
   }