const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

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
        let user = await User.findOne({email});
        if(user){
           return res
                .status(400)
                .json({ errors: [{msg: 'User already exists'}]});
        }
    // Get user gravatar
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });
    // encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
    
        // getting user payload;
        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'),
            { expiresIn: 360000},
            (err, token)=>{
                if(err) throw err;
                res.json({token});
            }
        )

        res.send('User registered');
    // Return jsonwebtoken
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;

