import { Router } from "express";
import LinkModel from "../models/LinkModel.js";

const router = Router();

router.get("/:code", async (req, res) => {
  try {
    const link = await LinkModel.findOne({ code: req.params.code });
    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }
    res.status(404).json({ message: "Not Found" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
