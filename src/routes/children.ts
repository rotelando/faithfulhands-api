import express from 'express';
import { ChildrenController } from '../controllers/children.controller';
import { ChildrenRepository } from '../repositories/children.repository';
import { ChildrenService } from '../services/children.service';

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