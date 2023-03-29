var express = require('express');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
var listHelper = require('../helpers/list-helpers');
const listHelpers = require('../helpers/list-helpers');

const { passwordCheck } = require('../helpers/user-helpers');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { json } = require('express');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const stream = require('stream');


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

  if (user) {

    res.render('./faculty/myProfile', { user })

  } else { res.redirect('/users/signOut') }

})







router.get('/changePassword', (req, res) => {

  let user = req.session.user


  if (user) {
    res.render('./faculty/changePassword', { user })
  } else { res.redirect('/users/signOut') }
})




router.get('/applyLeave/:id' , async (req, res) => {

  
  let user1 = req.session.user
  
  if (user1) {
    let user = await userHelpers.getUser(user1._id)
    
    let totalLeave = await userHelpers.getTotalLeave(req.params.id)


    res.render('./faculty/applyLeave', { user, totalLeave })
  }

  else { res.redirect('/users/signOut') }
})




router.get('/update-profile/:id', (req, res) => {


  userHelpers.getListDetails(req.params.id).then((user) => {


    res.render('./faculty/myProfile', { user })

  })
})


router.get('/leaveHistory/:id', async (req, res) => {

  
  let user = req.session.user

  if (user) {
    
    let leaves = await userHelpers.getUserLeave(req.params.id)
    let totalLeave = await userHelpers.getTotalLeave(req.params.id)
    let totalDl = await userHelpers.getTotalDutyLeave(req.params.id)
    let permission = await userHelpers.getPermission(req.params.id)
    console.log(permission)
    res.render('./faculty/leaveHistory', { leaves, user, totalLeave,permission,totalDl })
  }
  else {
    res.redirect('/users/signOut')
  }
})


router.get('/leave-info/:id', async (req, res) => {


  let user = req.session.user

  if (user) {

    listHelper.getLeaveDetails(req.params.id).then(async (leaves) => {

      res.render('./faculty/leaveInfo', { leaves, user })
    })
  }
  else { res.redirect('/users/signOut') }
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

router.post('/updatePassword/:id', (req, res) => {



  let pass = req.body
  userHelpers.passwordCheck(req.params.id, req.body).then((response) => {
    console.log(response.status);
    if (response.status) {

      req.session.loggedIn = true

      if (pass.newPassword === pass.confirmPassword) {



        userHelpers.updatePassword(req.params.id, req.body).then((response) => {
          res.redirect('/users/changePassword')

        })


      } else {
        console.log('pass not checked');
        res.redirect('/users/changePassword')
      }

    } else {
      res.redirect('/users/changePassword')
    }


  })
})


router.post('/applyLeave/:id', (req, res) => {
  
  listHelper.updateFacultyPermission2(req.params.id).then(()=>{

    
    userHelpers.addLeave(req.body).then(() => {
      
      res.redirect(`/users/applyLeave/${req.params.id}`)
    })
  })
    
})
//leave 


router.get('/leaves/:department', async (req, res) => {


  let list = await userHelpers.getLeaves(req.params.department).then((leaves) => {
    let user = req.session.user


    res.render('../views/faculty/leaves', { leaves, user })
  })



})

router.post('/unlockRequest', async (req, res) => {
  userHelpers.unlockRequest(req.body).then(() => {

    res.redirect('/users/applyLeave/' + req.body.id)
  })


})




router.post('/exportpdf', async (req, res) => {
  const [ facultyName, facultyCode, leaveType, leaveDatesFrom, leaveDatesTo, description, alternateArrangement, hodComment, princiComment, hrComment ] = req.body.doc;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Set the font styles
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Set the document title
  pdfDoc.setTitle('Leave Form');

  // Create a new page and add content
  const page = pdfDoc.addPage([550, 700]);

  // Set the font size and color
  page.drawText('Leave Form', { x: 175, y: 625, size: 24, font: font, color: rgb(0, 0.53, 0.71) });

  page.drawText(`Faculty Name: ${facultyName}`, { x: 50, y: 550, size: 14, font: font });
  page.drawText(`Code: ${facultyCode}`, { x: 50, y: 525, size: 14, font: font });
  page.drawText(`Type of Leave: ${leaveType}`, { x: 50, y: 500, size: 14, font: font });
  page.drawText(`From: ${leaveDatesFrom}`, { x: 50, y: 475, size: 14, font: font });
  page.drawText(`To: ${leaveDatesTo}`, { x: 50, y: 450, size: 14, font: font });
  page.drawText(`Description: ${description}`, { x: 50, y: 400, size: 14, font: font });
  page.drawText(`Alternate Arrangement: ${alternateArrangement}`, { x: 50, y: 375, size: 14, font: font });
  page.drawText(`HOD Comment: ${hodComment}`, { x: 50, y: 325, size: 14, font: font });
  page.drawText(`Principal Comment: ${princiComment}`, { x: 50, y: 300, size: 14, font: font });

  // Save the PDF document to a buffer
  const pdfBytes = await pdfDoc.save();

  // Set the response header for PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');

  // Pipe the PDF document to the response stream
  const responseStream = new stream.PassThrough();
  responseStream.end(pdfBytes);
  responseStream.pipe(res);

  // Handle errors that occur during piping the PDF document
  responseStream.on('error', (err) => {
    console.error(err);
    return res.status(500).json({ message: 'Error generating PDF' });
  });
});



module.exports = router;
