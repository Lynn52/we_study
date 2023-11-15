const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../models');
router.use(express.json());

router.get('/classes',function(req,res){    
    const Authorization = "Bearer " + req.session.passport.user.accessToken;
    axios.get(`https://classroom.googleapis.com/v1/courses`,{
        headers:{
            'Authorization':Authorization,
            'Accept' : 'application/json',
        }
    }).then((data)=>{       
        const filterData = data.data.courses.filter(course=>course.descriptionHeading === 'we-study');
        console.log(filterData);
        res.send(filterData);
    }).catch((err)=>{
        console.log(err.message);
    })
})

router.post('/class',function(req,res){    
    const Authorization = "Bearer " + req.session.passport.user.accessToken;
    console.log(req.body)
    res.send(req.body)
    axios.post(`https://classroom.googleapis.com/v1/courses`,req.body,{
        headers:{
            'Authorization': Authorization,
            'Accept' : 'application/json',
        }
    }).then((data)=>{
        axios.put(`https://classroom.googleapis.com/v1/courses/${data.data.id}`,{ 
            courseState : "ACTIVE",
            name: data.data.name,
            section: data.data.section,
            description: data.data.description,
            ownerId: "me",
            descriptionHeading: data.data.descriptionHeading,
        },{
            headers:{
                'Authorization': Authorization,
                'Accept' : 'application/json',
            }
        }).then((updateData)=>{
            models.class.create({
                id : updateData.data.id
            }).then(()=>{
                res.status(200).send('잘 됨');
            }).catch(err=>{
                console.log(err);
            })
        }).catch((err)=>{
            console.log(err.message)
        })
    }).catch((err)=>{
        console.log(err.message);
    })
})

router.put('/class',function(req,res){
    const Authorization = "Bearer " + req.session.passport.user.accessToken;
    const id = req.query.id;
    const mask = req.query.mask;
    axios.patch(`https://classroom.googleapis.com/v1/courses/${id}?${mask}`,req.body,{
        headers:{
            'Authorization': Authorization,
            'Accept' : 'application/json',
        }
    })
})

module.exports = router;