import mongoose from '@/config/MongooseConfig'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: String },
  username: { type: String },
  password: { type: String }
})

const UserModel = mongoose.model('users', UserSchema)

export default UserModel