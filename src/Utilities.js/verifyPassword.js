import bcrypt from "bcrypt"

//verifica la password in fase di login

export const verifyPassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
}