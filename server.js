const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const SpeakerService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');

const speakerService = new SpeakerService('./data/speakers.json');
const feedbackService = new FeedbackService('./data/feedback.json');


const ejs = require("ejs");

const routes = require('./routes');
const { request } = require('http');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(
    cookieSession({
        name: 'session',
        keys: ['userOne', 'UserTwo']
    })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views') )

app.locals.siteName = "ROUX Meetups";

app.use(express.static(path.join(__dirname, './static')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async(request, response, next) => {
    try {
        const names = await speakerService.getNames();
        response.locals.speakerNames = names;
        return next();
    } catch (err) {
        return next(err);
    }
})

// app.use('/throw', (request, response, next) => {
//     setTimeout(() => {
//         return next(new Error('Something did throw!'));
//     }, 500);
// });

app.use('/',
    routes({
        speakerService,
        feedbackService
    })
);

app.use((request, respnse, next) => {
    return createError(404, 'File Not Found');
})

app.use((err, request, respnse, next) => {
    respnse.locals.message = err.message;
    const status = err.status || 500;
    respnse.locals.status = status;
    respnse.status(status);
    respnse.render('error');
});

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});