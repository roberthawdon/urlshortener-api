const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema;

const userSchema = new schema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  }
});

userSchema.pre('save', async function(next){
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.password) {
    const hash = await bcrypt.hash(update.password, 10);
    this.setUpdate({ ...update, password: hash });
  }
  next();
});

userSchema.methods.isValidPassword = async function(password){
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// Use this to bypass password should authing be messed up.
// userSchema.methods.isValidPasswordBodge = async function(password){
//   return true;
// };

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
