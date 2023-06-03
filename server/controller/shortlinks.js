const express = require("express");
const router = express.Router();
const ShortLink = require("../models/shortlink");
function generateRandomSlug() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    slug += chars.charAt(randomIndex);
  }
  return slug;
}
// Get all short links
router.get("/", async (req, res) => {
  try {
    const shortLinks = await ShortLink.find();
    res.status(200).json({ shortlinks: shortLinks });
  } catch (error) {
    res.status(500).json({});
  }
});
//get one link
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const shortLink = await ShortLink.findOne({ slug });

    if (!shortLink) {
      res.status(404).json({ status: "failed", message: "not found" });
      return;
    }

    let destinationURL;

    // Determine the destination URL based on the user's platform
    const userAgent = req.headers["user-agent"];
    if (userAgent.includes("Android")) {
      destinationURL = shortLink.android.primary;
    } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      destinationURL = shortLink.ios.primary;
    } else {
      destinationURL = shortLink.web;
    }

    res.redirect(301, destinationURL);
  } catch (error) {
    res.status(500).json({});
  }
});

// Create a short link
router.post("/", async (req, res) => {
  try {
    const { slug, ios, android, web } = req.body;

    // Generate a random alphanumeric slug if not provided
    const generatedSlug = slug || generateRandomSlug();

    // Check if the generated slug is already in use
    const existingShortLink = await ShortLink.findOne({ slug: generatedSlug });
    if (existingShortLink) {
      return res
        .status(400)
        .json({ status: "failed", message: "Slug already in use" });
    }

    // Create the new shortlink
    const shortLink = new ShortLink({ slug: generatedSlug, ios, android, web });
    await shortLink.save();

    // Return the created shortlink details
    res
      .status(201)
      .json({
        status: "successful",
        slug: generatedSlug,
        message: "Created successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
});

// Update a short link
router.put("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;
    const shortLink = await ShortLink.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });
    if (!shortLink) {
      return res.status(404).json({ error: "Short Link not found" });
    }
    res.json({ status: "success", message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
