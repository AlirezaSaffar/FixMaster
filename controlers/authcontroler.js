const user = require('../models/Users')
const express = require("express")
const { ObjectId } = require('mongodb')
const joi = require("joi")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
class authController {
   static signup = async(req,res)=>{



    try {
        const schema = joi.object({
            name: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            phone: joi.string().pattern(/^[0-9]{10}$/).required(),  
            password: joi.string().min(6).required(),
            role: joi.string().valid('customer', 'technician').required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bycrypt.hash(req.body.password, saltRounds);

        const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

    static login = async(req,res)=>{
        try {
            const { email, password } = req.body;
    
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required.' });
            }
    
            const selecteduser = await user.findOne({ email });
            if (!selecteduser) {
                return res.status(400).json({ success: false, message: 'Invalid email or password.' });
            }
    
            const isMatch = await bycrypt.compare(password, selecteduser.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid email or password.' });
            }
    
            const token = jwt.sign(
                { userId: selecteduser._id, role: selecteduser.role }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
    
            res.cookie('token', token, {
                maxAge: 3600 * 1000, 
            });
    
            res.status(200).json({ success: true, message: 'Login successful' });
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
        }
}
}

module.exports = authController