import jwt from 'jsonwebtoken'

/**
 * Tạo JWT Token
 * @param {string} payload - Dữ liệu cần mã hóa
 * @param {string} secretSignature - Secret key để kí token
 * @param {string} tokenlife - Thời gian hết hạn token ('30m', '1d')
 * @returns {string} - Chuỗi token đã được mã hóa
 */
const generateToken = async (payload, secretSignature, tokenlife) => {
  try {
    return jwt.sign(payload, secretSignature, { expiresIn: tokenlife })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Verify JWT Token
 * @param {string} tokenVerify - Token xác thực
 * @param {string} secretSignature - Secret key để kí token
 * @returns {Object} - Payload đã decode nếu hợp lệ
 * @throws {Error} - Nếu token không hợp lệ hoặc hết hạn
 */
const verifyToken = async (tokenVerify, secretSignature) => {
  try {
    return jwt.verify(tokenVerify, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const jwtUtils = {
  generateToken,
  verifyToken
}
