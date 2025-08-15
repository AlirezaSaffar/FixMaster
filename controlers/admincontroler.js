const User = require('../models/Users');
const Request = require('../models/Requests');
const Offer = require('../models/Offer');
const Appointment = require('../models/Appointments');
const Payment = require('../models/Payments');
const Review = require('../models/Reviews');
const Admin = require('../models/Admin')
const express = require("express")
const { ObjectId } = require('mongodb')
const joi = require("joi")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

class adminControler {
 static getinfo = async (req,res)=>{
    try{
        const users = await User.find();
        const customerusers = await User.find({ role: 'customer' });
        const requests = await Request.find();
        const offers = await Offer.find();
        const appointments = await Appointment.find();
        const payments = await Payment.find();
        const reviews = await Review.find();
        const admin = await Admin.find();
        var limit = admin[0].limit
        const maxPrice = Math.max(...offers.map(offer => offer.amount));

        const avgPrice = offers.reduce((acc, offer) => acc + offer.amount, 0) / offers.length;

        const totalPayments = payments.reduce((acc, payment) => acc + payment.amount, 0);

        const avgrate =  reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

        const inProgressServices = appointments.filter(app => app.status === 'scheduled').length;
        const completedServices = appointments.filter(app => app.status === 'completed').length;

        res.json({
            customerusers: customerusers.length,
            technicianusers :users.length - customerusers.length,
            requests: requests.length,
            offers: offers.length,
            appointments: appointments.length,
            payments: totalPayments,
            reviews: reviews.length,
            maxPrice,
            avgPrice,
            inProgressServices,
            completedServices,
            avgrate,
            limit
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }


 }
 static setlimit = async (req,res)=>{    
    const newlimit = req.query.limit;
    const admin = await Admin.find();
    admin[0].limit = newlimit
    await admin[0].save()
    res.json({
        success: true
    })
}



}


module.exports = adminControler