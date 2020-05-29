import mongoose from 'mongoose'
mongoose.connect('mongodb://localhost:27017/admin', { useNewUrlParser: true })

export default mongoose