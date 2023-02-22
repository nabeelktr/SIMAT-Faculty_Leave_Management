var express = require('express');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
var listHelper = require('../helpers/list-helpers');
const listHelpers = require('../helpers/list-helpers');

const { passwordCheck } = require('../helpers/user-helpers');
const bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb')


/* GET users listing. */
router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/users/facultyLogin')
})



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

if(user){
  
  res.render('./faculty/myProfile', { user })

}else{res.redirect('/users/signOut') }

})







router.get('/changePassword', (req, res) => {
  
  let user = req.session.user
  

  if(user){
  res.render('./faculty/changePassword', { user })
  }else{res.redirect('/users/signOut') }
})




router.get('/applyLeave/:id', async(req, res) => {
  
   let user = req.session.user
  if(user){
  let totalLeave=await userHelpers.getTotalLeave(req.params.id)
    
     res.render('./faculty/applyLeave', { user,totalLeave })
   }
 
  else{res.redirect('/users/signOut') }
})




router.get('/update-profile/:id', (req, res) => {


  userHelpers.getListDetails(req.params.id).then((user) => {
    
  
    res.render('./faculty/myProfile', { user })

  })
})


router.get('/leaveHistory/:id', async (req, res) => {


  let user = req.session.user
 
if(user){
  
  let leaves=await userHelpers.getUserLeave(req.params.id)
  
    res.render('./faculty/leaveHistory', {leaves,user})
}else{res.redirect('/users/signOut') }
  })
     

  router.get('/leave-info/:id', async (req, res) => {


    let user = req.session.user
   
  if(user){
    
    listHelper.getLeaveDetails(req.params.id).then(async(leaves) => {
    
      res.render('./faculty/leaveInfo', {leaves,user})
  })}
  else{res.redirect('/users/signOut') }
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


  userHelpers.updateList(req.params.id, req.body).then((users) => {
    
    let user = users.body
   
  
    res.render('./faculty/myProfile', { user })

  })



})

router.post('/updatePassword/:id',(req,res)=>{

  
  
  let pass=req.body
  userHelpers.passwordCheck(req.params.id,req.body).then((response)=>{
    console.log(response.status);
    if (response.status) {
      
      req.session.loggedIn = true
      
      if(pass.newPassword === pass.confirmPassword){
        
        
          
          userHelpers.updatePassword(req.params.id,req.body).then((response)=>{
            res.redirect('/users/changePassword')
            
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
  
  
  userHelpers.addLeave(req.body).then(()=>{
    
    res.redirect('/users/applyLeave/:id')
  })
  
})
//leave 


router.get('/leaves/:department',async (req,res)=>{
  
  
  let list=await userHelpers.getLeaves(req.params.department).then((leaves)=>{
    let user = req.session.user
    
  
    res.render('../views/faculty/leaves',{leaves,user})
  })
  
  
    
  })

  

module.exports = router;
