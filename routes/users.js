var express = require('express');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
var listHelper = require('../helpers/list-helpers');
const listHelpers = require('../helpers/list-helpers');

const { passwordCheck } = require('../helpers/user-helpers');
const bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb')
/* GET users listing. */
router.get('/facultyLogin', function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/users/myProfile')
  } else {

    res.render('./faculty/facultyLogin', { loginErr: req.session.loginErr });
    req.session.loginErr = false
  }
});

router.get('/myProfile', function (req, res) {
  let user = req.session.user
  if(user.hod != "none" ){
    user.hood = true }

  
  res.render('./faculty/myProfile', { user })
})





router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/users/facultyLogin')
})


router.get('/changePassword', (req, res) => {
  
  let user = req.session.user
  if(user.hod != "none" ){
    user.hood = true }

  
  res.render('./faculty/changePassword', { user })
})

router.get('/applyLeave', (req, res) => {
  
  let user = req.session.user
  if(user.hod != "none" ){
    user.hood = true }

  
  res.render('./faculty/applyLeave', { user })
})



router.get('/update-profile/:id', (req, res) => {


  listHelper.getListDetails(req.params.id).then((user) => {
    if(user.hod != "none" ){
      user.hood = true }
  
    res.render('./faculty/myProfile', { user })

  })
})


router.get('/leaveHistory/:id', async (req, res) => {


  let user = req.session.user
  if(user.hod != "none" ){
    user.hood = true }

  
  let leaves=await userHelpers.getAllLeave(req.params.id)
  console.log(leaves);
    res.render('./faculty/leaveHistory', {leaves,user})
  })
    
  
    
  

  


// post

router.post('/login', (req, res) => {


  userHelpers.doLogin(req.body).then((response) => {


    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/users/myProfile')



    } else {
      req.session.loginErr = "Enter Valid Details.."
      res.redirect('/users/facultyLogin')

    }
  })




})



router.post('/update-profile/:id', (req, res) => {


  listHelper.updateList(req.params.id, req.body).then((users) => {
    
    let user = users.body
    if(user.hod != "none" ){
      user.hood = true }
  
    res.render('./faculty/myProfile', { user })

  })



})

router.post('/updatePassword/:id',(req,res)=>{

  console.log('first');
  
  let pass=req.body
  userHelpers.passwordCheck(req.params.id,req.body).then((response)=>{
    console.log(response.status);
    if (response.status) {
      
      req.session.loggedIn = true
      
      if(pass.newPassword === pass.confirmPassword){
        console.log('pass checked');
        
          
          listHelper.updatePassword(req.params.id,req.body).then((response)=>{
            res.redirect('/users/signOut')
          })
        
        
      }else{
        console.log('pass not checked');
        res.redirect('/users/changePassword')
      }

    }else{
      res.redirect('/users/changePassword')
    }

    
  })
})


router.post('/applyLeave/:id', (req, res) => {
  
  console.log(req.body);
  userHelpers.addLeave(req.body).then((response)=>{
    
    res.redirect('/users/applyLeave')
  })
  
})
//leave 


router.get('/leaves',async (req,res)=>{
  
  
  let list=await userHelpers.getLeaves().then((leaves)=>{
    let user = req.session.user
    
  
    res.render('./faculty/leaves',{leaves,user})
  })
  
  
    
  })

  router.get('/accept-action/:id', (req, res) => {

      let status={status:'Approved'}
    listHelper.updateLeave(req.params.id,status).then((response)=>{
      res.redirect('/users/leaves')
    })
  
})

router.get('/reject-action/:id', (req, res) => {

  let status={status:'Rejected'}
listHelper.updateLeave(req.params.id,status).then((response)=>{
  res.redirect('/users/leaves')
})

})

module.exports = router;
