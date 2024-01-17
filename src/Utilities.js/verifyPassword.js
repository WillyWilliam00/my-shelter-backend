import bcrypt from "bcrypt"

export const verifyPassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
}