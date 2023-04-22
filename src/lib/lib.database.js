import mongoose from "mongoose"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
mongoose.set('strictQuery', false)
let database


const __dirname = path.dirname(fileURLToPath(import.meta.url))


if (/mongo/.test(global.options.URI)) {
     database = class MongoDB {
      constructor(url) {
         this.url = url

         this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
            keepAliveInitialDelay: 30000
         }
         this.connection = this.url || global.options.URI
         this.model = {
            database: {}
         }
         this.data = {}
      }
       
       read = async () => {
          mongoose.connect(this.connection, {
             ...this.options
          })
          try {
             const schemaData = new mongoose.Schema({
                data: {
                   type: Object,
                   required: true,
                   default: {}
                }
             })
             this.model.database = mongoose.model('data', schemaData)
          } catch {
             this.model.database = mongoose.model('data')
          }
          this.data = await this.model.database.findOne({})
          if (!this.data) {
             (new this.model.database({
                data: {}
             })).save()
             this.data = await this.model.database.findOne({})
             return this.data = this.data?.data
          } else return this.data
       }
 
       write = async (data) => {
          const obj = data ? data : global.db
          if (this.data && !this.data.data) return (new this.model.database({
             data: obj
          })).save()
          this.model.database.findById(this.data._id, (error, document) => {
             if (error) return
             if (!document.data) document.data = {}
             document.data = global.db
             document.save()
          })
       }
    }
} else if (/json/.test(global.options.URI)) {
      database = class Database {
        file = fs.existsSync(global.options.URI) ? path.resolve(global.options.URI) : path.join(__dirname, "..", "..", "temp", "database.json")
        
        data = {}

        read = async() => {
            try {
                return this.data = fs.existsSync(this.file) ? JSON.parse(fs.readFileSync(this.file)) : {}
            } catch(e) {
                console.error(e)
                return this.data = {}
            }
        }

        write = async() => {
            let dirname = path.dirname(this.file)
            if (fs.existsSync(dirname)) await fs.mkdir(dirname, { recursive:true })
            await fs.writeFile(this.file, JSON.stringify(this.data))
            return this.file
        }
    }
}


export { database }