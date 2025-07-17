export const REGEX = {
  objectId: /^[0-9a-fA-F]{24}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  phone: /^(0|\+84)[1-9][0-9]{8}$/
}
export const MESSAGE = {
  required: 'Trường này là bắt buộc',
  invalidEmail: 'Email không hợp lệ!',
  invalidPhone: 'Số điện thoại không hợp lệ',
  invalidPassword: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!',
  invalidObjectId: 'ID phải có dạng ObjectId của MongoDB!'
}
