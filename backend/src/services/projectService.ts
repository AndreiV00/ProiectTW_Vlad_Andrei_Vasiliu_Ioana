import * as express from 'express';
import Project from '../models/project';
import User from '../models/user';
import * as jwt from 'jsonwebtoken';
import { JWT_VALIDITY_SECONDS, ROLES } from '../config/constants';

/*
When posting a project you need to specifify the project itself and also add the members
of the team that will work on the project
*/
const postProject = async (req: express.Request, res: express.Response) => {
  if (req.body.role != ROLES.ProjectMember) {
    return res
      .status(403)
      .json({ error: 'You are not authorized (not a ProjectMember).' });
  }
  const project = new Project(req.body);
  project.save();
  res.send(project);
};

const getProjects = async (req: express.Request, res: express.Response) => {
  //preia proiectele din baza de date
  const projects = await Project.find();

  res.send(projects);
};

const updateProjects = async (req: express.Request, res: express.Response) => {
  console.log(req.body.role);
  if (req.body.role != ROLES.None) {
    return res
      .status(403)
      .json({
        error:
          'You are not authorized because you already have the role ' +
          req.body.role,
      });
  }
  const user_id = req.body.user_id;
  const token = await updateUserRoleToTester(user_id);

  const projects = await Project.findById(req.params.projectId);
  projects.users.push(user_id);
  await projects.save();

  res.status(200).json({ message: 'Tester succesfully added to the project', token: token });
};

const updateUserRoleToTester = async (user_id: String) => {
  const user = await User.findById(user_id);
  user.role = ROLES.Tester;
  user.save();

  return jwt.sign(
    { user_id: user._id, user_name: user.name, role: user.role },
    process.env.TOKEN_KEY,
    {
      expiresIn: JWT_VALIDITY_SECONDS,
    }
  );
};

export { getProjects, postProject, updateProjects };
