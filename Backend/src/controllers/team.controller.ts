import { Request, Response } from 'express'
import { prisma } from '../config'
import bcrypt from 'bcryptjs'

// Récupération de toutes les équipes
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany()
    res.json(teams)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Récupération d'une équipe précise via son id
export const getTeamById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const teamId = req.params.id

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    })

    if (!team) {
      res.status(404).json({ message: 'Team not found' })
      return
    }

    res.json(team)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Récupération d'une équipe précise via son nom
export const getTeamByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const teamNameRaw = req.query.name;
  if (typeof teamNameRaw !== "string" || !teamNameRaw.trim()) {
    res.status(400).json({ message: "Le paramètre 'name' est requis et doit être une chaîne non vide." });
    return;
  }

const teamName = teamNameRaw.trim();


  try {
    const team = await prisma.team.findUnique({
      where: { teamname: teamName }
    });

    if (!team) {
      res.status(404).json({ message: 'Équipe non trouvée.' });
      return;
    }

    res.status(200).json({ teamId: team.id, teamName: team.teamname });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur interne du serveur', error: errorMessage });
  }
};

// Modification des informations d'une équipe
export const updateTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const teamId = req.params.id
  const updateData = req.body

  try {
    const dataToUpdate: { [key: string]: any } = {}

    if (updateData.teamname !== undefined)
      dataToUpdate.teamname = updateData.teamname
    if (updateData.ceoFirstName !== undefined)
      dataToUpdate.ceoFirstName = updateData.ceoFirstName
    if (updateData.ceoLastName !== undefined)
      dataToUpdate.ceoLastName = updateData.ceoLastName
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email
    if (updateData.description !== undefined)
      dataToUpdate.description = updateData.description
    if (updateData.teamColor !== undefined)
      dataToUpdate.teamColor = updateData.teamColor
    if (updateData.rosterList !== undefined)
      dataToUpdate.rosterList = updateData.rosterList ?? null

    if (updateData.password) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10)
    }

    // Gestion de l'upload de logo
    if (req.file) {
      dataToUpdate.logoUrl = req.file.filename
    }

    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ message: 'No valid fields provided for update' })
      return
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: dataToUpdate
    })

    res.json(updatedTeam)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Suppression d'une équipe
export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const teamId = req.params.id

  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } })

    if (!team) {
      res.status(404).json({ message: 'Team not found' })
      return
    }

    await prisma.team.delete({ where: { id: teamId } })

    res.json({ message: 'Team deleted successfully' })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
