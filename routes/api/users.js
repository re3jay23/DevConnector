const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');


// @route   POST api/users
// @desc    register user
// @access  Public

router.post('/',[ 
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email','Please include a valid email')
            .isEmail(),
        check('password','Please enter a password with 6 characters or more')
            .isLength({ min: 6 })
    ],async(req, res)=>{
    //console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    

    const { name, email, password } = req.body;

    try{
    // see if user exists
        let user = await User.findOne({
            email
        });
        if(user){
            res.status(400).json({ errors: [{msg: 'User already exists'}]});
        }
    // Get user gravatar

    // encrypt password

    // Return jsonwebtoken
    }catch(error){
        res.status(500).send('Server error');
    }

   


    res.send('Register user')
});

module.exports = router;

