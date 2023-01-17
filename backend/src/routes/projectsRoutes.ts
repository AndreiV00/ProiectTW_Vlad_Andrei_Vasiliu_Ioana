import * as express from 'express';
import {
  postProject,
  getProjects,
  updateProjects,
} from '../services/projectService';
import { isLogedIn } from '../middleware/authenticate';

const router = express.Router();

router.get('/projects', isLogedIn, getProjects);

router.post('/projects', isLogedIn, postProject);

router.put('/projects/:projectId', isLogedIn, updateProjects);

export default router;
