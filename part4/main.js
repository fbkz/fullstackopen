const config = require("./utils/config");
const app = require("./app");

const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server running: http://localhost:${PORT}`);
  }
});
