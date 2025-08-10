const user = require('../models/Users')
const express = require("express")
const { ObjectId } = require('mongodb')
const joi = require("joi")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
class userController {
   static dashbord = async(req,res)=>{

        try {
            const userId = req.user.userId;
            const role = req.user.role;

            const selecteduser = await user.findById(userId);

            if (!selecteduser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            return res.status(200).json({
                success: true,
                response: {
                    name: selecteduser.name,
                    email: selecteduser.email,
                    phone: selecteduser.phone,
                    role: role,
                }
            });
        } catch (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }


}

module.exports = userController