import { Request, Response } from 'express'
import { prisma } from '../config'

import { User } from '@prisma/client'

export const createFollow = async (
  req: Request,
    res: Response
): Promise<void> => {
    const { followerId, followedId } = req.body
    
    try {
        const follow = await prisma.follow.create({
            data: {
                followerId,
                followedId,
            },
        })
        res.status(201).json(follow)

    } catch (error) {
        const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
        res
        .status(500)
        .json({ message: 'Internal Server Error', error: errorMessage })
    }
    }