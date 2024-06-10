const express = require('express');
const speakersRoutes = require('./speakers.js');
const feedbackRoutes = require('./feedback.js');

const router = express.Router();


module.exports = params => {
    
    const { speakerService } = params;
    router.get('/', async(request, response) => {

        // if (!request.session.visitcount) 
        //     request.session.visitcount = 0;
        // request.session.visitcount += 1;
        // console.log(`Number of visit count ${request.session.visitcount}`);

        const artwork = await speakerService.getAllArtwork();
        const topSpeakers = await speakerService.getList();
        response.render('layout', { pageTitle: "Welcome" , template: 'index', topSpeakers, artwork})
    });
    

    
    router.use('/speakers', speakersRoutes(params));
    router.use('/feedback', feedbackRoutes(params));

    return router;
};