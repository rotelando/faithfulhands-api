import express from "express";
import { CareSessionsController } from "../controllers/careSessions.controller.js";
import { CareSessionsService } from "../services/careSessions.service.js";
import { CareSessionsRepository } from "../repositories/careSessions.repository.js";

const careSessionsRoutes = express.Router();

const careSessionsRepository = new CareSessionsRepository();
const careSessionsService = new CareSessionsService(careSessionsRepository);
const careSessionsController = new CareSessionsController(careSessionsService);

careSessionsRoutes.get("/", (req, res) => {
  careSessionsController.getCareSessions(req, res);
});

careSessionsRoutes.post("/", (req, res) => {
  careSessionsController.createCareSession(req, res);
});

export default careSessionsRoutes;

