const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: [true, 'Please enter a username'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Min length is 6 characters'],
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static methods to login user
userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return user;
        }
        throw new Error('incorrect password');
    }
    throw new Error('incorrect username');
}

const User = mongoose.model('user', userSchema);

module.exports = User;