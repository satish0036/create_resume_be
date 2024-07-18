import { db } from "../db.js"; // Ensure db is configured to use promises

export const addUser = async (req, res) => {
  const { username, name, password } = req.body;

  console.log(username, name);

  try {
    // Check if username already exists
    // const userCheckQuery = "SELECT * FROM user_auth WHERE username = ?";
    // const [existingUser] = await db.execute(userCheckQuery, [username]);
    const [existingUser] = await db.promise().query(
        "SELECT * FROM  user_auth WHERE username = ?",
        [username]
      );


    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Insert new user into the database
    const addUserQuery = "INSERT INTO user_auth (username, name, password) VALUES (?, ?, ?)";
    await db.execute(addUserQuery, [username, name, password]);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const userSignIn = async (req, res) => {
    const { username, password } = req.body;  
    try {
      // Check if username already exists
      // const userCheckQuery = "SELECT * FROM user_auth WHERE username = ?";
      // const [existingUser] = await db.execute(userCheckQuery, [username]);
      const [existingUser] = await db.promise().query(
          "SELECT * FROM  user_auth WHERE username = ?",
          [username]
        );
  
  
      if (existingUser.length === 0) {
        return res.status(409).json({ message: "Username not exists" });
      }
      if(existingUser[0].password===password){
        const { password , ...data } = existingUser[0];
        return res.status(201).json({
            data,
          message: "User featched successfully" });
      }
  
      return res.status(400).json({
        message: "Wrong Password" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
