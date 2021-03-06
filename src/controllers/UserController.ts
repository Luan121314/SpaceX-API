import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { UserModelInterface } from '../models/UserModel'
import usersViews from '../views/userView';
import cripto from 'crypto';
import userValidation from '../validates/UserValidation';

export default class User {
    async create(request: Request, response: Response) {
        const data = request.body;

        await userValidation.create(data)

        const hash = cripto.randomBytes(6).toString('hex');
        const user = new UserModel

        await user.create({ ...data, id: hash }, (err, doc) => {
            response.status(201).json(usersViews.render(doc as UserModelInterface));
        });
        return

    }

    async index(request: Request, response: Response) {
        const user = new UserModel;
        const result = await user.read() as UserModelInterface[];
        return response.json(usersViews.renderMany(result));
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        await userValidation.id({ id })

        const user = new UserModel;
        const result = await user.read(id) as UserModelInterface
        return response.status(200).json(usersViews.render(result));
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { name, gender, about, github } = request.body;
        const data = {
            id,
            name,
            gender,
            about,
            github
        }

        await userValidation.update(data)

        const user = new UserModel;
        await user.update(data, (err, raw) => {
            const { n } = raw;
            return n as number == 1 ? (
                response.status(204).json({})
            ) : (
                response.status(404).json({ message: 'id not found' }))
        })
        return
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params

        await userValidation.id({ id })

        const user = new UserModel;
        await user.delete(id, (err) => {
            return response.status(204).json({})
        })
    }
}