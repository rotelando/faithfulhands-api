import express from 'express';
import { PartiesController } from '../controllers/parties.controller.js';
import { PartiesRepository } from '../repositories/parties.repository.js';
import { PartiesService } from '../services/parties.service.js';

const partiesRoutes = express.Router();

// Initialize dependencies
const partiesRepository = new PartiesRepository();
const partiesService = new PartiesService(partiesRepository);
const partiesController = new PartiesController(partiesService);

// Routes
partiesRoutes.get('/', (req, res) => {
  partiesController.getParties(req, res);
});

export default partiesRoutes;
