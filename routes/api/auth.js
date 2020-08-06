const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get('/', auth, async (req, res)=> {
    try{
        const userx = await User.findById(req.user.id).select("-password");
        res.json(userx);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error')
    }
    

});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public

router.post('/',[ 
    check('email','Please include a valid email')
        .isEmail(),
    check('password','password is required')
        .exists()
],async(req, res)=>{
    //console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    const { email, password } = req.body;

    try{
    // see if user exists
        let user = await User.findOne({email});
        if(!user){
        return res
                .status(400)
                .json({ errors: [{msg: 'Invalid credentials'}]});
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch){
        return res
            .status(400)
            .json({ errors: [{msg: 'Invalid credentials'}]}); 
        }
        
        // getting user payload;
        const payload = {
            user:{
                id: user.id
            }
        }

        // Return jsonwebtoken
        jwt.sign(
            payload,
            config.get('jwtToken'),
            { expiresIn: 360000},
            (err, token)=>{
                if(err) throw err;
                res.json({token});
            }
        )


    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }

});
module.exports = router;
