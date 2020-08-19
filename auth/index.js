const express = require('express');
const router = express.Router();
//include joi for entry checking
const Joi = require('joi');
//include db (monk) to access backend database to store the data
const db = require('../db/connection');
const bcrypt = require('bcryptjs')

const users = db.get('users');
users.createIndex('username', {unique: true});


const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(20).required(),
    password: Joi.string().min(10).required()
});
//any route in here is pre-pended with /auth

router.get('/', (req, res)=>{

    res.json({
        message: "Hi Wilson!"
    });

});

//POST auth/signup
router.post('/signup', (req, res, next)=>{
    
    const result = Joi.validate(req.body, schema);
   
    if(result.error === null){

        users.findOne({

            username: req.body.username

        }).then(user =>{
            if(user){
                //there is already a user in the db with this username
                //respond with an error
                const error = new Error('That user is not OG. Please choose another one.');
                next(error);
            }else{
                //hash the password

                bcrypt.hash(req.body.password, 12).then(hashPassword =>{
                    res.json({ hashPassword });
                });

            }
            
         
        });
    
    }else{

        next(result.error);
    }


});

module.exports = router;