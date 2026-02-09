export const signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // TEMP RESPONSE (to test backend)
    return res.status(201).json({
      message: "Signup successful 🎉",
      user: { name, email, phone },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  res.json({ message: "Login route working" });
};
