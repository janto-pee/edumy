import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(process.env.SALTWORKFACTOR));
  const hash = bcrypt.hashSync(password, salt);
  password = hash;
  return password;
}

export async function comparePassword(
  confirm_password: string,
  password: string,
) {
  const check = await bcrypt
    .compare(confirm_password, password)
    .catch(() => false);

  return check;
}
