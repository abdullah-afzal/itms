import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 4000;
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const server = app.listen(PORT, () => {
    console.log(`Backend server is running at ${PORT}`)
})

function handleExit() {
    server.close(() => {
        console.log(`\n Backend server stopped gracefully`);
        process.exit(0);
    });

}

process.once("SIGINT", () => handleExit());
process.once("SIGTERM", () => handleExit());
