const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userID: {
        type: 'string',
        required: [true, 'Please enter a user ID'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: 'string',
        default: 'vnuhcmiu',
        required: [true, 'Please enter a password'],
        minlength: [6, 'Min length is 6 characters'],
    },
    role: {
        type: 'string',
        default: 'student',
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static methods to login user
userSchema.statics.login = async function (userID, password) {
    const user = await this.findOne({ userID });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return user;
        }
        throw new Error('incorrect password');
    }
    throw new Error('incorrect user ID');
}

const User = mongoose.model('user', userSchema); // 'user' is the name of the collection in the database

module.exports = User;