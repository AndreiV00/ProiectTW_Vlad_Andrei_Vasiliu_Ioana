import * as express from 'express';
import { isLogedIn } from '../middleware/authenticate';
import {
  getBugs,
  postBug,
  getBug,
  updateBug,
  assignBugToUser,
} from '../services/bugService';

const router = express.Router();

router.post('/projects/:projectId/bugs', isLogedIn, postBug);

router.get('/projects/:projectId/bugs', isLogedIn, getBugs);

router.get('/projects/:projectId/bugs/:bugId', isLogedIn, getBug);

router.put('/projects/:projectId/bugs/:bugId', isLogedIn, updateBug);

router.post('/projects/:projectId/bugs/:bugId', isLogedIn, assignBugToUser);

export default router;
