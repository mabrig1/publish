import app from "./api/index.js";

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`PublishAI backend listening on port ${port}`));
