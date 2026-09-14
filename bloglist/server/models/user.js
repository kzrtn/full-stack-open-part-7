const { Model, default: mongoose } = require('mongoose')

require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: [3, 'username too short'],
    maxLength: [18, 'username too long'],
    required: true,
    unique: true,
    validate: {
      validator: v => {
        return /[a-zA-Z0-9]\w+/.test(v)
      },
      message: props => `${props.value} is not a valid username`
    }
  },
  passwordHash: {
    type: String,
    select: false,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User