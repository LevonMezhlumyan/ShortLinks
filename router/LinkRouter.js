import config from "config";
import shortid from "shortid";
import { Router } from "express";
import LinkModel from "../models/LinkModel.js";
import useAuth from "../middleware/AuthMiddleware.js";
import mongoose from "mongoose";

const router = Router();

router.post("/generate", useAuth, async (req, res) => {
  try {
    const baseUrl = process.env.BASEURL;
    const { from } = req.body;
    const existing = await LinkModel.findOne({ from, owner: req.user.userId });
    if (existing) {
      return res.json(existing);
    }
    const code = shortid.generate();
    const to = baseUrl + "/t/" + code;
    const link = new LinkModel({ code, to, from, owner: req.user.userId });
    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", useAuth, async (req, res) => {
  try {
    const links = await LinkModel.find({ owner: req.user.userId });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", useAuth, async (req, res) => {
  try {
    const link = await LinkModel.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/delete/:id", useAuth, async (req, res) => {
  try {
    const link = await LinkModel.deleteOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (link && link.deletedCount) {
      return res.json({ message: "Deleted", success: true, ...link });
    }
    res.status(400).json({ success: false, ...link });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
