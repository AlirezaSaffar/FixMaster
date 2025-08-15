const user = require('../models/Users')
const Request = require('../models/Requests');
const Offer = require('../models/Offer')
const Appointment = require('../models/Appointments');
const Payment = require('../models/Payments');
const Review = require('../models/Reviews');
const Admin = require('../models/Admin');
const express = require("express")
const { ObjectId } = require('mongodb')
const joi = require("joi")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

function sendSMS(phone, message) {
  console.log(`[MOCK SMS] To: ${phone} | Message: ${message}`);
}

function sendEmail(email, subject, body) {
  console.log(`[MOCK EMAIL] To: ${email} | Subject: ${subject} | Body: ${body}`);
}


class userController {
   static dashbord = async(req,res)=>{

        try {
            const userId = req.user.userId;
            const role = req.user.role;

            const selecteduser = await user.findById(userId);

            if (!selecteduser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
         
            let avgRating = " there is no rate ";
            var avg=5
            if(role==="technician"){

              const result = await Review.aggregate([
                { $match: { technician: selecteduser._id } },
                {
                  $group: {
                    _id: "$technician",
                    avgRating: { $avg: "$rating" }
                  }
                }
              ]);          
             
          
              if (result.length > 0 && result[0].avgRating != null) {
                avgRating = result[0].avgRating.toFixed(2);
              }
            }

            return res.status(200).json({
                success: true,
                response: {
                    name: selecteduser.name,
                    email: selecteduser.email,
                    phone: selecteduser.phone,
                    role: role,
                    city:selecteduser.city,
                    service:selecteduser.service,
                    avgRating:avgRating
               }
            });
        } catch (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }
    static newrequest = async(req,res)=>{
        try {
            const { description, location, service , warranty} = req.body;
      
            if (!description) {
              return res.status(400).json({ success: false, message: 'Description is required' });
            }
      
            let images = [];
            if (req.files && req.files.length > 0) {
              images = req.files.map(file => `/uploads/${file.filename}`);
            }
            var warr = warranty=="yes"
      
            const newRequest = new Request({
              customer: req.user.id, 
              description,
              location,
              service,
              images,
              warranty:warr
            });
      
            await newRequest.save();
const currentUser = await user.findById(req.user.id);

sendSMS(currentUser.phone, "Your request has been successfully created ");
sendEmail(currentUser.email, "Request Created", "Your request has been successfully created and is now pending review.");

      
            return res.status(201).json({
              success: true,
              message: 'Request created successfully',
              request: newRequest
            });
          } catch (err) {
            console.error('Error creating request:', err);
            return res.status(500).json({
              success: false,
              message: 'Server error'
            });
          }
    }

    static getmyrequests = async(req,res)=>{
      try {
        const customerId = req.user.id; 
        const requests = await Request.find({ customer: customerId }).sort({ createdAt: -1 });
    
        res.status(200).json({
          success: true,
          requests
        });
      } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({
          success: false,
          message: "Server error"
        });
      }
    }

    static getrequests = async(req,res)=>{
      try {
        const requests = await Request.find({ status: 'pending' }).sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  requests,
});

      } catch (err) {
        console.error("Error fetching requests:", err);
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    }

    static setoffer = async(req,res)=>{
      try {
        const { id } = req.params;
        const { price, message , time } = req.body;

        if (!price || !message) {
            return res.status(400).json({ success: false, message: "Price and message are required" });
        }

        const admin =await Admin.find()
        const limit = admin[0].limit
        if(price > limit){
          return res.status(400).json({ success: false, message: "your price is out of limit of admin" });

        }



        const requestExists = await Request.findById(id);
        if (!requestExists) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const existingOffer = await Offer.findOne({
            requestId: id,
            technicianId: req.user.id
        });

        if (existingOffer) {
            return res.status(400).json({ success: false, message: "You have already made an offer for this request" });
        }

        const offer = new Offer({
          requestId: id,
          technicianId: req.user.id,
            amount: price,
            message,
            time
        });

        await offer.save();

        res.status(201).json({
            success: true,
            message: "Offer submitted successfully",
            offer
        });

    } catch (err) {
        console.error("Error creating offer:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
    }

   

      static getrequestdetails = async (req, res) => {
        try {
          const requestId = req.params.requestId;
    
          const request = await Request.findById(requestId)
            .populate('customer', 'name email'); 
    
          if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
          }
    
          res.json({
            title: request.service,
            description: request.description,
            images: request.images,
            location: request.location,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            warranty: request.warranty,
          });
    
        } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
        }
      }
    
      static getrequestoffers = async (req, res) => {
        try {
          const requestId = req.params.requestId;    
          const offers = await Offer.find({ requestId })
            .populate('technicianId', 'name email ');


            const technicianIds = offers.map(o => o.technicianId._id);
            const ratings = await Review.aggregate([
              { $match: { technician: { $in: technicianIds } } },
              {
                $group: {
                  _id: "$technician",
                  avgRating: { $avg: "$rating" }
                }
              }
            ]);
            const ratingsMap = {};
            ratings.forEach(r => {
              ratingsMap[r._id.toString()] = r.avgRating;
            });
            let maxRating = -Infinity;
            ratings.forEach(r => {
              if (r.avgRating > maxRating) maxRating = r.avgRating;
            });

            

            
          // const formattedOffers = offers.map(o => ({
          //   _id: o._id,
          //   technicianId: o.technicianId._id,
          //   technicianName: o.technicianId.name,
          //   amount: o.amount,
          //   message: o.message,
          //   status: o.status,
          //   timee : o.time,
          //   createdAt: o.createdAt
          // }));
          const formattedOffers = offers.map(o => {
            const techIdStr = o.technicianId._id.toString();
            return {
              _id: o._id,
              technicianId: o.technicianId._id,
              technicianName: o.technicianId.name,
              amount: o.amount,
              message: o.message,
              status: o.status,
              timee: o.time,
              createdAt: o.createdAt,
              best: ratingsMap[techIdStr] === maxRating
            };
          });
          
    
          res.json(formattedOffers); 
        } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
        }
      }


      static setappointment = async(req , res)=>{

        try {
          const { offerId, time } = req.body;
  
          if (!offerId || !time) {
              return res.status(400).json({ success: false, message: 'Missing required fields' });
          }

  
          const offer = await Offer.findById(offerId);
          if (!offer) {
              return res.status(404).json({ success: false, message: 'Offer not found' });
          }

  
          const appointment = new Appointment({
              request: offer.requestId,
              customer: req.user.id, 
              technician: offer.technicianId,
              appointmentTime: offer.time, 
          });
  
          await appointment.save();
  
          offer.status = 'accepted';
          await offer.save();
const customerInfo = await user.findById(req.user.id);
const technicianInfo = await user.findById(offer.technicianId);

sendSMS(customerInfo.phone, `Your appointment for ${offer.time} has been confirmed.`);
sendEmail(customerInfo.email, "Appointment Confirmed", `Your appointment for ${offer.time} has been confirmed.`);

sendSMS(technicianInfo.phone, `You have a new appointment scheduled for ${offer.time}.`);
sendEmail(technicianInfo.email, "New Appointment", `You have a new appointment scheduled for ${offer.time}.`);


          const payment = new Payment({
              customer: req.user.id ,
               technician:offer.technicianId,
               offer: offer._id,
               amount: offer.amount
          })

          await payment.save();

          const request = await Request.findById(offer.requestId);
          if (!request) {
              return res.status(404).json({ success: false, message: 'Request not found' });
          }

          request.status = 'completed';
          await request.save();
            
          res.status(200).json({
              success: true,
              message: 'Appointment created successfully',
              appointment
          });
  
      } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
      }


      }
      static getappointments = async(req , res)=>{
        try {
          const userId = req.user.userId;
          const role = req.user.role; 
          let query = {};
          if (role === "customer") {
              query.customer = userId;
          } else if (role === "technician") {
              query.technician = userId;
          } else {
              return res.status(400).json({ message: "Invalid role" });
          }


          const appointments = await Appointment.find(query)
              .populate("request", "description location warranty")
              .populate("customer", "name phone")
              .populate("technician", "name phone")
              .sort({ appointmentTime: -1 });





          const results = appointments.map(appt => ({
              ...appt.toObject(),
              feedbackGiven: !!appt.feedback 
          }));

          res.json({
              appointments: results,
              role
          });

      } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
      }
  

      }

      static addreview = async(req,res)=>{try {
        const customerId = req.user.id;
        const { appointmentId, feedback, rating } = req.body;
  
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
  
        if (appointment.customer.toString() !== customerId) {
          return res.status(403).json({ message: 'You can only review your own appointments' });
        }
  
        const review = new Review({
          customer: customerId,
          technician: appointment.technician,
          rating,
          comment: feedback
        });
        await review.save();
  
        appointment.status = 'completed';
        await appointment.save();
const techInfo = await user.findById(appointment.technician);

sendSMS(techInfo.phone, "You have received a new review ⭐");
sendEmail(techInfo.email, "New Review", "A new review has been submitted for you. Please check your dashboard.");

  
        res.status(200).json({ message: 'Review submitted and appointment marked as completed ✅' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }}


}

module.exports = userController