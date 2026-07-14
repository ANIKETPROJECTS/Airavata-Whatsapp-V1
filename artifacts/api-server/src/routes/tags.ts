import { Router } from "express";
import { TagModel } from "../models/Tag";
import { ContactModel } from "../models/Contact";
import { authenticate, type AuthRequest } from "../middlewares/authenticate";

const router = Router();
router.use(authenticate);

// GET /api/tags
router.get("/tags", async (req: AuthRequest, res) => {
  try {
    const tags = await TagModel.find({ userId: req.user!.userId }).sort({ name: 1 });
    res.json({ tags: tags.map(t => ({ id: t._id, name: t.name, color: t.color })) });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/tags
router.post("/tags", async (req: AuthRequest, res) => {
  try {
    const { name, color } = req.body as { name?: string; color?: string };
    if (!name?.trim()) { res.status(400).json({ error: "name is required" }); return; }

    const tag = await TagModel.create({
      userId: req.user!.userId,
      name: name.trim(),
      color: color ?? "#22c55e",
    });

    res.status(201).json({ tag: { id: tag._id, name: tag.name, color: tag.color } });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({ error: "A tag with this name already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// DELETE /api/tags/:id
router.delete("/tags/:id", async (req: AuthRequest, res) => {
  try {
    const tag = await TagModel.findOne({ _id: req.params["id"], userId: req.user!.userId });
    if (!tag) { res.status(404).json({ error: "Tag not found" }); return; }

    // Remove tag reference from all contacts
    await ContactModel.updateMany(
      { userId: req.user!.userId, tags: tag._id },
      { $pull: { tags: tag._id } },
    );
    await tag.deleteOne();

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
