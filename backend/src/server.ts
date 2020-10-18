import express from 'express'
import route from './routes'
import './database/connection'
import path from 'path'
import 'express-async-errors'
import errorHandler from './errors/handler'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(route)
app.use('/uploads', express.static(path.join(__dirname,'..','upload')))
app.use(errorHandler)
app.listen(3333)