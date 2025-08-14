const user = require('../models/Users')
const Request = require('../models/Requests');
const Offer = require('../models/Offer')
const Appointment = require('../models/Appointments');
const Payment = require('../models/Payments');
const Review = require('../models/Reviews');
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
            const { description, location, service } = req.body;
      
            if (!description) {
              return res.status(400).json({ success: false, message: 'Description is required' });
            }
      
            let images = [];
            if (req.files && req.files.length > 0) {
              images = req.files.map(file => `/uploads/${file.filename}`);
            }
      
            const newRequest = new Request({
              customer: req.user.id, 
              description,
              location,
              service,
              images
            });
      
            await newRequest.save();
      
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
            .populate('customer', 'name email')         
            .populate('acceptedTechnician', 'name email'); 
    
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
            acceptedTechnician: request.acceptedTechnician,
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
            .populate('technicianId', 'name email');
          const formattedOffers = offers.map(o => ({
            _id: o._id,
            technicianId: o.technicianId._id,
            technicianName: o.technicianId.name,
            amount: o.amount,
            message: o.message,
            status: o.status,
            timee : o.time,
            createdAt: o.createdAt
          }));
    
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
              .populate("request", "description location")
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
  
        // پیدا کردن ملاقات
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
  
        // چک کردن اینکه مشتری صاحب ملاقات هست
        if (appointment.customer.toString() !== customerId) {
          return res.status(403).json({ message: 'You can only review your own appointments' });
        }
  
        // ایجاد فیدبک جدید
        const review = new Review({
          customer: customerId,
          technician: appointment.technician,
          rating,
          comment: feedback
        });
        await review.save();
  
        // تغییر وضعیت ملاقات به completed
        appointment.status = 'completed';
        await appointment.save();
  
        res.status(200).json({ message: 'Review submitted and appointment marked as completed ✅' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }}


}

module.exports = userController