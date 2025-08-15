const user = require('../models/Users')
const express = require("express")
const { ObjectId } = require('mongodb')
const Review = require('../models/Reviews');
const joi = require("joi")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
class authController {
   static signup = async(req,res)=>{

    console.log(req.body.city)

    try {
        const schema = joi.object({
            name: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            phone: joi.string().pattern(/^[0-9]{10}$/).required(),
            password: joi.string().min(6).required(),
            role: joi.string().valid('customer', 'technician').required(),
            city: joi.when('role', {
                is: 'technician',
                then: joi.string().required(),
            }),
            service: joi.when('role', {
                is: 'technician',
                then: joi.string().valid('plumbing', 'electrical', 'cleaning', 'carpentry', 'none').required(),
            })
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
            role: req.body.role,
            city: req.body.city,
            service:req.body.service
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

            res.cookie('role', selecteduser.role, {
                maxAge: 3600 * 1000, 
            });
            
    
            res.status(200).json({ success: true, message: 'Login successful' });
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
        }
}
        static findtechnician = async(req,res)=>{
            try {
                const { city, service } = req.query;
                const filter = { role: "technician", isActive: true };
        
                if (city && city.trim() !== "") {
                    filter.city = { $regex: new RegExp(city, "i") }; 
                }
        
                if (service && service.trim() !== "" && service !== "none") {
                    filter.service = service;
                }
        
                const technicians = await user.find(filter).select("-password -__v");
        
                res.json({
                    success: true,
                    technicians: technicians
                });
            } catch (err) {
                console.error("Error finding technicians:", err);
                res.status(500).json({ success: false, message: "Server error. Please try again later." });
            }

        
}

static getTechnicianProfile = async (req, res) => {
    try {
      const technicianId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        return res.status(400).json({ success: false, message: 'Invalid technician ID.' });
      }
  
      const technician = await user.findById(technicianId).select('name email phone city service role');
  
      if (!technician || technician.role !== 'technician') {
        return res.status(404).json({ success: false, message: 'Technician not found.' });
      }
  
      const result = await Review.aggregate([
        { $match: { technician: technician._id } },
        {
          $group: {
            _id: "$technician",
            avgRating: { $avg: "$rating" }
          }
        }
      ]);
  
      let avgRating = " there is no rate ";
  
      if (result.length > 0 && result[0].avgRating != null) {
        avgRating = result[0].avgRating.toFixed(2);
      }
      const reviews = await Review.find({ technician: technician._id }).populate('customer', 'name').sort({ createdAt: -1 });

  
      res.json({
        success: true,
        data: {
          name: technician.name,
          email: technician.email,
          phone: technician.phone,
          city: technician.city,
          service: technician.service,
          averageRating: avgRating,
          reviews: reviews
        }
      });
    } catch (err) {
      console.error("Error fetching technician profile:", err);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  }

}

module.exports = authController