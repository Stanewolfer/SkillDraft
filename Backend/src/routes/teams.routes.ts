import { Router } from 'express'
import {
  getTeamById,
  getTeams,
  updateTeam,
  deleteTeam,
  getTeamByName
} from '../controllers/team.controller'
import { uploadAvatar } from '../middleware/multer'

const teamRouter = Router()

teamRouter.get('/get-teams', getTeams)
teamRouter.get('/get-team-by-id/:id', getTeamById)
teamRouter.get('/get-team-by-name', getTeamByName)
teamRouter.put('/update/:id', uploadAvatar, updateTeam)
teamRouter.delete('/delete/:id', deleteTeam)

export default teamRouter
