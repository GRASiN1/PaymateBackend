const corsOptions = {
  origin: [
    "http://localhost:3001", // Local development
    "http://localhost:3000", // Local development
    "https://paymate-frontend.vercel.app"
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
