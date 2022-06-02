// grab our db client connection to use with our adapters
const client = require("../client");
const bcrypt = require("bcrypt"); //for hashing

async function createUser({ email, password, isAdmin }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  // console.log({ hashedPassword });
  // console.log(email, password, isAdmin);

  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users(email,password,"isAdmin")
      VALUES($1,$2,$3)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `,
      [email, hashedPassword, isAdmin]
    );

    // console.log("user w/ password:", user);

    delete user.password;

    // console.log("user w/o password:", user);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id,email
      FROM users 
      WHERE id=$1
    `,
      [id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

//only admin should be able to do this
//doesn't include admin in this line-up
async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
      SELECT *
      FROM users
      WHERE "isAdmin" = false
    `);

    return users;
  } catch (error) {
    throw error;
  }
}

//used by function getUser(email)
async function getUserByUsername(email) {
  // console.log("email shows up as", email, "in getUserByUsername");
  // { email: 'plantboss@mail.com' }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE email=$1;
    `,
      [email]
    );

    // console.log("from getUserByUsername:", user);

    return user;
  } catch (error) {
    throw error;
  }
}

//for logging in
async function getUser(email, password) {
  // console.log({ email, password }, "combo");
  const savedUser = await getUserByUsername(email);
  // console.log({ savedUser });
  const hashedPassword = savedUser.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  // console.log("From getUser:", passwordsMatch);

  if (passwordsMatch) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT *
        FROM users
        WHERE email=$1
      `,
        [email]
      );

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  // add your database adapter fns here
  client,
  createUser,
  getUserById,
  getUserByUsername,
  getUser,
  getAllUsers,
};
