const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const path = require('path');
const passport = require('./passport');
const app = express();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const uploadDataPath = path.join(__dirname, 'uploads');

require('dotenv').config();

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

const PORT = process.env.PORT || 8080;

mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0-egxif.mongodb.net/test?retryWrites=true&w=majority`,
	{ useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, autoIndex: false })
	.then(() => console.log('MongoDB connected'))
	.catch(e => console.log('MongoDB could not be connected due to ', e));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use('/', express.static(path.join(__dirname, '..', 'dist')))
// app.use('/uploads/', express.static(path.join(__dirname, 'uploads')))
app.use(morgan('dev'))

app.use(
	session({
		secret: process.env.APP_SECRET || 'my sweet secret',
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false
		}
	})
)

app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

app.use('/auth', require('./routes/auth'))
app.use('/config', require('./routes/config'))
app.use('/seller', require('./routes/seller'))
app.use('/customer', require('./routes/customer'))
app.use('/approval', require('./routes/approval'))

app.get('/upload', (req, res) => {
	res.sendFile(path.join(uploadDataPath, req.query.location));
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.post('/upload', (req, res, next) => {

	if (Object.keys(req.files).length == 0) {
    return res.status(400).json({message: 'No files were uploaded.'});
	}
	

	let uploadFile = req.files[Object.keys(req.files)[0]];
	
	const uniqueNumber = new Date().getTime();

  uploadFile.mv(`${uploadDataPath}/file-${uploadFile.name}`, function(err) {
    if (err)
      return res.status(500).send(err);

    res.status(200).json({
			message :'File uploaded!', 
			name: req.files[Object.keys(req.files)[0]].name, 
			status: "done", 
			url: `/upload?location=file-${req.files[Object.keys(req.files)[0]].name}`
		});
  });
});

app.listen(PORT, () => console.log(`listening on port - ${PORT}`)) 
