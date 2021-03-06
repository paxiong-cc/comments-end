import mongoose from '@/config/MongooseConfig'
import moment from 'moment'

const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  favs: { type: Number },
  lastSign: { type: Date }
})

SignRecordSchema.pre('save', function(next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignRecordSchema.statics = {
  findByUid: function(uid) {
    return this.findOne({ uid }).sort({ created: -1 })
  }
}

const SignRecord = mongoose.model('sign_record', SignRecordSchema)

export default SignRecord
