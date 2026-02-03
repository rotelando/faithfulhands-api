import express from 'express';
import { ClassesController } from '../controllers/classes.controller.js';
import { ClassesRepository } from '../repositories/classes.repository.js';
import { ClassesService } from '../services/classes.service.js';

const classesRoutes = express.Router();

// Initialize dependencies
const classesRepository = new ClassesRepository();
const classesService = new ClassesService(classesRepository);
const classesController = new ClassesController(classesService);

// Routes
classesRoutes.get('/', (req, res) => {
  classesController.getClasses(req, res);
});

export default classesRoutes;
