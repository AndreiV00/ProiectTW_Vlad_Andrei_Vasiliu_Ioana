import * as express from 'express';
import Bug from '../models/bug';
import Project from '../models/project';
import { ROLES } from '../config/constants';
import User from '../models/user';
import mongoose from 'mongoose';

//Find bugs for given project ID
const getBugs = async (req: express.Request, res: express.Response) => {
  try {
    var project = await Project.findById(req.params.projectId); //Find the project
    var bugs = await Bug.find({ _id: { $in: project.bugs } }); //Find every bug in the given IDs array
    res.send(bugs);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
};

//Post a bug for given project ID
const postBug = async (req: express.Request, res: express.Response) => {
  if (req.body.role != ROLES.Tester) {
    return res
      .status(403)
      .json({ error: 'You are not authorized (not a tester).' });
  }

  try {
    const bug = new Bug(req.body); //create the bug
    const project = await Project.findById(req.params.projectId); //Add bugID to the project
    project.bugs.push(bug.id);
    project.save();
    bug.save();
    res.send(bug);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
};

//Get a bug by its ID
const getBug = async (req: express.Request, res: express.Response) => {
  try {
    const bug = await Bug.findById(req.params.bugId);
    res.send(bug);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
};

//Update entire bug (used for adding resolving commit)
const updateBug = async (req: express.Request, res: express.Response) => {
  try {
    const updatedBug = req.body;
    const result = await Bug.findOneAndUpdate(
      { _id: req.params.bugId },
      updatedBug
    );
    res.send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
};

//Update entire bug (used for adding resolving commit)
const assignBugToUser = async (req: express.Request, res: express.Response) => {
  if (req.body.role != ROLES.ProjectMember) {
    return res.status(403).json({
      error: 'You are not a project member',
    });
  }

  if (await isTheBugAssigned(req.params.bugId)) {
    return res.status(409).json({
      error: 'The bug is already assigned to someone',
    });
  }
  //TODO TEst this user assigning the bug if the bug is not used
  const user = await User.findById(req.body.user_id);
  const objectId = new mongoose.Types.ObjectId(req.params.bugId);
  user.bugs.push(objectId);
  await user.save();
  return res.status(200).json({ message: 'The bug is now assigned to you' });
};

const isTheBugAssigned = async (bugId: String) => {
  //Find all the users of that specific bug
  const users = await User.find({ bugs: bugId }).populate('bugs').exec();
  return users.length > 0 ? true : false;
};
export { getBugs, postBug, getBug, updateBug, assignBugToUser };
