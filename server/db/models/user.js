const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	type: {
		type: String,
		default: "end user"
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	local: {
		name: {
			first: { type: String },
			last: { type: String }
		},
		email: {
			type: String,
			unique: true,
		},
		password: { type: String },
		photo: { type: String }
	},
	google: {
		id: { type: String },
		name: {
			first: { type: String },
			last: { type: String },
		},
		email: { type: String },
		photo: { type: String }
	},
	linkedin: {
		id: { type: String },
		name: {
			first: { type: String },
			last: { type: String },
		},
		email: { type: String },
		photo: { type: String }
	},
	facebook: {
		id: { type: String },
		name: {
			first: { type: String },
			last: { type: String },
		},
		email: { type: String },
		photo: { type: String }
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
