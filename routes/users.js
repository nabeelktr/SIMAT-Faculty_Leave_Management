var express = require('express');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
var listHelper = require('../helpers/list-helpers');
const listHelpers = require('../helpers/list-helpers');
const { passwordCheck } = require('../helpers/user-helpers');
const bcrypt=require('bcrypt')
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
  res.render('./faculty/myProfile', { user })
})





router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/users/facultyLogin')
})


router.get('/changePassword', (req, res) => {
  
  let user = req.session.user
  
  res.render('./faculty/changePassword', { user })
})

router.get('/applyLeave', (req, res) => {
  
  let user = req.session.user
  
  res.render('./faculty/applyLeave', { user })
})



router.get('/update-profile/:id', (req, res) => {


  listHelper.getListDetails(req.params.id).then((user) => {
    
    res.render('./faculty/myProfile', { user })

  })
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

module.exports = router;
