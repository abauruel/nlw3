import {Request, Response} from 'express'
import Orphanage from '../model/Orphanage'
import {getRepository} from 'typeorm'
import orphanageView from '../views/OrphanageView'
import * as Yup from 'yup'

export default {
    async create(request: Request, response: Response){
        
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends } = request.body
    
        const orphanagesRepository = getRepository(Orphanage)
        const requestImages =request.files as Express.Multer.File[]
        const images = requestImages.map(image=> {
            return { path: image.filename}
        })
        const data ={
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        }
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends : Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required(),
            }))
        })
        
        await schema.validate(data, {
            abortEarly: false,
        })

        const orphanage:Orphanage = orphanagesRepository.create(data)
        await orphanagesRepository.save(orphanage)

        return response.status(200).json(orphanage)
    },

    async index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage) 
        const orphanages = await orphanagesRepository.find({
            relations:['images']
        })

        return response.status(200).json(orphanageView.renderMany(orphanages))
       },
    async show(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage) 
        const orphanage = await orphanagesRepository.findOneOrFail(request.params.id,{
            relations:['images']
        })

        return response.status(200).json(orphanageView.render(orphanage))
    }
}