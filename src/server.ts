import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { readdirSync } from "fs";
import { join } from "path";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) return res.status(400).send("Please provide an image url");

    // Read previous files before filtering
    const files = readdirSync(join(__dirname, "util", "tmp"));

    const filteredImageFile = await filterImageFromURL(image_url);

    res.sendFile(filteredImageFile);

    await deleteLocalFiles(files);
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
