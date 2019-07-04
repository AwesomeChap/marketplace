const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	name: {
		first: {
			type: String,
			unique: false,
			required: true
		},
		last: {
			type: String,
			unique: false,
			required: true
		}
	},
	local: {
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			unique: false,
			required: true
		}
	}
})

userSchema.methods = {
	checkPassword: function (inPwd) {
		return bcrypt.compareSync(inPwd, this.local.password);
	},
	hashPassword: unEncPwd => {
		return bcrypt.hashSync(unEncPwd, 15);
	}
}

userSchema.pre('save', function (next) {
	console.log(this);
	if (!this.local.password) {
		console.log('Password not provided');
		next();
	} else {
		this.local.password = this.hashPassword(this.local.password);
		next();
	}
})

const User = mongoose.model('User', userSchema)
module.exports = User
