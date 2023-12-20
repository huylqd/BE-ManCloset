import axios from "axios"

export const getPass = async (resetToken) => {
    const res = await axios.patch(`http://localhost:8088/user/resetPassword/${resetToken}`)
    return res
}