import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import apiKeysRouter from "./apikeys";
import contactsRouter from "./contacts";
import groupsRouter from "./groups";
import tagsRouter from "./tags";
import templatesRouter from "./templates";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(apiKeysRouter);
router.use(contactsRouter);
router.use(groupsRouter);
router.use(tagsRouter);
router.use(templatesRouter);

export default router;
