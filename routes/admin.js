var express = require('express');
var hbs = require('hbs');
hbs.registerPartials(__dirname + './views/partials')
const { Db, Decimal128 } = require('mongodb');
var router = express.Router();
const listHelper = require('../helpers/list-helpers');
const summaryHelpers = require('../helpers/summary-helpers');
const userHelpers = require('../helpers/user-helpers');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./admin-panel/index', {});
});

router.get('/adminLogin', (req, res) => {
  res.render('../views/admin-panel/adminlogin', { admin: 'admin' })
})





//  })

router.get('/list', (req, res) => {

  res.render('../views/admin-panel/addList')


})


router.get('/viewList', (req, res) => {
  userHelpers.getAllList().then((lists) => {
    res.render('../views/admin-panel/admin', { lists })
  })
})

router.get('/delete-list/:id', (req, res) => {
  let listId = req.params.id
  listHelper.deleteList(listId).then((response) => {
    res.redirect('/viewList')
  })
})

router.get('/edit-list/:id', async (req, res) => {
  let list = await userHelpers.getListDetails(req.params.id)
  console.log(list);

  res.render('./admin-panel/editList', { list })
})


router.get('/leaves', async (req, res) => {
  let list = await userHelpers.getLeaves().then((leaves) => {
    res.render('./admin-panel/leaves', { leaves })
  })



})







// post

router.post('/login', (req, res) => {

  let user = req.body
  if (user.name === 'admin' && user.password === '123')
    userHelpers.getAllList().then((lists) => {
      res.render('../views/admin-panel/admin', { lists })
    })


  else {

    res.redirect('/adminLogin')

  }

})

router.post('/addList', (req, res) => {


  listHelper.addlist(req.body).then((response) => {
    res.redirect('/viewList')
  })
})
router.post('/edit-list/:id', (req, res) => {


  userHelpers.updateList(req.params.id, req.body).then((response) => {
    res.redirect('/viewList')
  })

})



// Hod


router.get('/signout', (req, res) => {

  req.session.destroy()

  res.redirect('/hodLogin')
})

router.post('/hodLogin', (req, res) => {


  userHelpers.HodDoLogin(req.body).then((response) => {


    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      const user = response.user
      res.render('../views/admin-panel/hod/hodProfile', { user })



    } else {
      req.session.loginErr = "Enter Valid Details.."
      res.redirect('/hodLogin')

    }
  })
})




router.get('/addHod', (req, res) => {
  res.render('../views/admin-panel/hod/addHod')
})

router.get('/hod', async (req, res) => {
  let list = await userHelpers.getHod().then((hod) => {
    res.render('./admin-panel/hod/hod', { hod })
  })
})

router.post('/add-Hod', (req, res) => {


  userHelpers.addHod(req.body).then((response) => {
    res.redirect('/hod')
  })
})
router.get('/hodProfile', async (req, res) => {
  let user = req.session.user
  if (user) {

    res.render('./admin-panel/hod/hodProfile', { user })

  } else {
    res.redirect('/signout')
  }


})


router.get('/hodLogin', (req, res) => {
  if (req.session.loggedIn) {
    res.render('../views/admin-panel/hod/hodProfile')



  } else {

    res.render('../views/admin-panel/hod/hodLogin', { loginErr: req.session.loginErr });
    req.session.loginErr = false
  }
});


// leaves


router.get('/leaves1/:department', async (req, res) => {


  let list = await userHelpers.getLeaves(req.params.department).then((leaves) => {
    let user = req.session.user



    res.render('../views/admin-panel/leaves', { leaves, user })
  })



})


router.get('/leaves1', async (req, res) => {

  let user = req.session.user
  if (user) {
    let list = await userHelpers.getLeaves(user.department).then((leaves) => {




      res.render('../views/admin-panel/leaves', { leaves, user })
    })

  } else {
    res.redirect('/signout')
  }

})


router.get('/accept-leave/:id/:comment', (req, res) => {
  let status = [{ hodStatus: true }, { princiStatus: undefined }]

  listHelper.updateLeave(req.params.id, status, decodeURI(req.params.comment)).then((response) => {
    res.redirect('/leaves1')
  })

})

router.get('/reject-leave/:id/:comment', (req, res) => {

  let status = [{ hodStatus: false }, { princiStatus: undefined }]
  listHelper.updateLeave(req.params.id, status, decodeURI(req.params.comment)).then((response) => {
    res.redirect('/leaves1')
  })

})

router.get('/leave-action/:id/:ts', (req, res) => {


  listHelper.getLeaveDetails(req.params.id).then(async (leaves) => {
    let user = req.session.user
    let totalLeave = await userHelpers.getTotalLeave(req.params.ts)

    res.render('../views/admin-panel/leaveDetails', { leaves, user, totalLeave })
  })

})

router.get('/monthcheck/:id/:month', (req, res) => {

  listHelper.monthCheck(req.params.id, req.params.month).then((status) => {
    if (status[0] != null)
      res.sendStatus(400)
    else
      res.sendStatus(200)
  })
})

router.get('/halfmonthcheck/:id/:month', (req, res) => {

  
  listHelper.halfmonthCheck(req.params.id, req.params.month).then((nod) => {
    if(nod[0] != null){
    statuss =parseFloat(nod[0].totalLeaves.toString())
  console.log(statuss,"half")
    
    if ( statuss > 0.5)
      res.sendStatus(400)
    else
      res.sendStatus(201)
    }else{
      res.sendStatus(200)
    }
  })
})


//princi

router.get('/signoutPrinci', (req, res) => {



  res.redirect('/princiLogin1')
})

router.post('/princiLogin', (req, res) => {


  userHelpers.PrinciDoLogin(req.body).then((response) => {


    if (response.status) {
      login = true
      let user1 = userHelpers.getPrinci().then((user) => {



        res.render('../views/admin-panel/principal/princiProfile', { user })

      })

    } else {
      login = false

      res.redirect('/princiLogin')

    }

  })
})




router.get('/addPrinci', (req, res) => {
  res.render('../views/admin-panel/principal/addPrinci')
})

router.get('/princi', (req, res) => {
  userHelpers.getPrinci().then((princi) => {
    console.log(princi)
    res.render('../views/admin-panel/principal/princi', { princi })
  })
})

router.post('/add-Princi', (req, res) => {


  userHelpers.addPrinci(req.body).then((response) => {
    res.redirect('/princi')
  })
})
router.get('/princiProfile', (req, res) => {


  userHelpers.getPrinci().then((user) => {
    res.render('./admin-panel/principal/princiProfile', { user })
  })



})




router.get('/princiLogin', (req, res) => {
  if (login) {
    res.render('../views/admin-panel/principal/princiProfile')



  }
  else {
    loginErr = "Enter Valid Details.."
    res.render('../views/admin-panel/principal/princiLogin', { loginErr });
    login = false
  }
});

router.get('/princiLogin1', (req, res) => {
  res.render('../views/admin-panel/principal/princiLogin')
})


router.get('/princiLeaves2', async (req, res) => {

  let list = await userHelpers.getFullLeave().then(async (leaves) => {
    let user1 = await userHelpers.getPrinci().then((user) => {
      res.render('../views/admin-panel/principal/princiLeaves', { leaves, user })
    })
  })


})

router.get('/accept-princiLeave/:id/:comment', (req, res) => {

  let status = [{ hodStatus: true }, { princiStatus: true }]

  listHelper.updateLeave(req.params.id, status, decodeURI(req.params.comment)).then((response) => {
    res.redirect('/princiLeaves2')
  })

})

router.get('/reject-princiLeave/:id/:comment', (req, res) => {

  let status = [{ hodStatus: true }, { princiStatus: false }]
  listHelper.updateLeave(req.params.id, status, decodeURI(req.params.comment)).then((response) => {
    res.redirect('/princiLeaves2')
  })

})


router.get('/princi-leave-action/:id/:ts', (req, res) => {


  listHelper.getLeaveDetails(req.params.id).then(async (leaves) => {

    let totalLeave = await userHelpers.getTotalLeave(req.params.ts)
    let user1 = await userHelpers.getPrinci().then((user) => {
      res.render('../views/admin-panel/leaveDetails', { leaves, user, totalLeave })
    })

  })
})



//HR



router.get('/addHr', (req, res) => {
  res.render('../views/hr/addHr')
})

router.get('/hr', async (req, res) => {
  let list = await userHelpers.getHr().then((hr) => {
    res.render('../views/hr/hr', { hr })
  })
})



router.post('/add-Hr', (req, res) => {


  userHelpers.addHr(req.body).then((response) => {
    res.redirect('/hr')
  })
})

router.get('/signoutHr', (req, res) => {



  res.redirect('/hrLogin1')
})

router.get('/hrLogin1', (req, res) => {
  res.render('../views/hr/hrLogin')
})



router.post('/hrLogin', (req, res) => {


  userHelpers.HrDoLogin(req.body).then((response) => {


    if (response.status) {
      login = true
      let user1 = userHelpers.getHr().then((user) => {



        res.redirect('/hrProfile')

      })

    } else {
      login = f

      res.redirect('/hrLogin')

    }
  })
})


router.get('/hrLogin', (req, res) => {
  if (login) {
    res.redirect('/hrProfile')
  } else {
    loginErr = "Enter Valid Details.."
    res.render('../views/hr/hrLogin', { loginErr });
    login = false
  }
})


router.get('/hrsummary/:year', async (req, res) => {

    const id = req.params.year;
    const year = parseInt(id);
    
  
    let casualLeaves = await summaryHelpers.getTotalLeave(year,"Casual Leave");
    let dutyLeaves = await  summaryHelpers.getTotalLeave(year,"Duty Leave");
    
    cseCL = await summaryHelpers.getDeptLeave(year,"Casual Leave","cse");
    ceCL = await summaryHelpers.getDeptLeave(year,"Casual Leave","ce");
    meCL = await summaryHelpers.getDeptLeave(year,"Casual Leave","me");
    eeeCL = await summaryHelpers.getDeptLeave(year,"Casual Leave","eee");
    eceCL = await summaryHelpers.getDeptLeave(year,"Casual Leave","ece");
    
    cseDL = await summaryHelpers.getDeptLeave(year,"Duty Leave","cse");
    ceDL = await summaryHelpers.getDeptLeave(year,"Duty Leave","ce");
    meDL = await summaryHelpers.getDeptLeave(year,"Duty Leave","me");
    eeeDL = await summaryHelpers.getDeptLeave(year,"Duty Leave","eee");
    eceDL = await summaryHelpers.getDeptLeave(year,"Duty Leave","ece");

    let user1 = await userHelpers.getHr().then((user) => {
    
      
     
      res.render('../views/hr/summary', { casualLeaves, dutyLeaves,user,cseCL,cseDL,ceCL,ceDL,meCL,meDL,eeeCL,eeeDL,eceCL,eceDL,year })
    })
  })

router.get('/findLeave',async (req,res)=>{
  let list = await userHelpers.getHr().then((user) => {
  res.render('../views/hr/findLeave', {user})
  })
})







router.get('/hrProfile', async (req, res) => {


  let list = await userHelpers.getHr().then((user) => {


    res.render('../views/hr/hrProfile', { user })
  })



})

router.get('/hr-leave-action/:id/:ts', (req, res) => {


  listHelper.getLeaveDetails(req.params.id).then(async (leaves) => {
    
    let totalLeave = await userHelpers.getTotalLeave(req.params.ts)
    let user1 = await userHelpers.getHr().then((user) => {
      res.render('../views/admin-panel/leaveDetails', { leaves, user, totalLeave })
    })

  })
})

router.post('/hrFacSearch',async (req,res)=>{
  
    data = req.body.value.toUpperCase();
    
    let totalLeave = await userHelpers.getTotalLeave(data)
    let totalDl = await userHelpers.getTotalDutyLeave(data)
    let facLeaves = await summaryHelpers.getFacLeave(data)
    const TL =totalLeave.toString();
    const DL =totalDl.toString();
    
    if(facLeaves != "empty" ){
      res.status(200).json({facLeaves,TL,DL});
    }
    else{
    res.status(201).json({msg:"faculty not found"})
    
    }
    
    })



router.post('/hrsingleleave', async(req,res)=>{
  const singleLeave= await summaryHelpers.getSingleLeave(req.body.input);
  
  res.json({singleLeave})
})


// Permission RQST
router.get('/permissionRqst/:dept', (req, res) => {
  user = req.session.user
  if (user) {
    
    listHelper.getPermissionList(req.params.dept).then((list) => {
      res.render('../views/admin-panel/hod/permission', { list, user})
    })
  } else {
    res.redirect('/signout')
  }
})
router.get('/permission-accept/:id/:dept/:userid', (req, res) => {
 
  if (user) {
    var action="Accepted"
    
    listHelper.editPermissionList(req.params.id, action).then(() => {
      listHelper.updateFacultyPermission(req.params.userid).then(()=>{

        listHelper.getPermissionList(req.params.dept).then((list) => {
          res.render('../views/admin-panel/hod/permission', { user,list })
        })
      })

    })
  }
  else {
    res.redirect('/signout')
  }
})
router.get('/permission-reject/:id/:dept', (req, res) => {
  console.log("paraaamsss",req.params.id, req.params.dept)
  if (user) {
    var action="Rejected"
    
    listHelper.editPermissionList(req.params.id, action).then(() => {
      listHelper.getPermissionList(req.params.dept).then((list) => {
        res.render('../views/admin-panel/hod/permission', { user,list })
      })

    })
  }
  else {
    res.redirect('/signout')
  }
})

module.exports = router;
