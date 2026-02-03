import express from 'express';
import { ChildrenController } from '../controllers/children.controller.js';
import { ChildrenRepository } from '../repositories/children.repository.js';
import { ChildrenService } from '../services/children.service.js';

const childrenRoutes = express.Router();

// Initialize dependencies
const childrenRepository = new ChildrenRepository();
const childrenService = new ChildrenService(childrenRepository);
const childrenController = new ChildrenController(childrenService);

// Routes
childrenRoutes.get('/', (req, res) => {
  childrenController.getChildren(req, res);
});

export default childrenRoutes;