import bcrypt from "bcrypt";

export const incript = async (item) => {
  const salt = await bcrypt.genSalt();
  const incripteditem = await bcrypt.hash(item, salt);
  return incripteditem;
};
