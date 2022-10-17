var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
var listHelper = require('../helpers/list-helpers');
const userHelpers = require('../helpers/user-helpers');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./admin-panel/index', {});
});

router.get('/adminLogin', (req, res) => {
  res.render('../views/admin-panel/adminlogin')
})





//  })

router.get('/list', (req, res) => {

  res.render('../views/admin-panel/addList')


})


router.get('/viewList', (req, res) => {
  listHelper.getAllList().then((lists) => {
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
  let list = await listHelper.getListDetails(req.params.id)
  console.log(list);

  res.render('./admin-panel/editList', { list })
})


router.get('/leaves', async (req, res) => {
  let list = await userHelpers.getLeaves().then((leaves) => {
    res.render('./admin-panel/leaves', { leaves })
  })



})

router.get('/accept-action/:id', (req, res) => {

  let status = { status: 'admin Approved' }
  listHelper.updateLeave(req.params.id, status).then((response) => {
    res.redirect('/leaves')
  })

})

router.get('/reject-action/:id', (req, res) => {

  let status = { status: 'admin Rejected' }
  listHelper.updateLeave(req.params.id, status).then((response) => {
    res.redirect('/leaves')
  })

})





// post

router.post('/login', (req, res) => {

  let user = req.body
  if (user.name === 'admin' && user.password === '123')
    listHelper.getAllList().then((lists) => {
      res.render('../views/admin-panel/admin', { lists })
    })
  else if (user.name === 'hod' && user.password === 'cse')
    listHelper.getAllList().then((lists) => {
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


  listHelper.updateList(req.params.id, req.body).then((response) => {
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
    // let list = await userHelpers.getLeaves().then((leaves) => {
    res.render('./admin-panel//hod/hodProfile', { user })//, { leaves })
    // })
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


router.get('/accept-leave/:id', (req, res) => {

  let status = { status: 'Hod Approved ' }

  listHelper.updateLeave(req.params.id, status).then((response) => {
    res.redirect('/leaves1')
  })

})

router.get('/reject-leave/:id', (req, res) => {

  let status1 = { status1: 'Hod Rejected ' }
  listHelper.updateLeave(req.params.id, status1).then((response) => {
    res.redirect('/leaves1')
  })

})


//princi

router.get('/signoutPrinci', (req, res) => {



  res.redirect('/princiLogin')
})

router.post('/princiLogin', (req, res) => {


  userHelpers.PrinciDoLogin(req.body).then((response) => {


    if (response.status) {
      login = true
      let user1 = userHelpers.getPrinci().then((user) => {



        res.render('../views/admin-panel/principal/princiProfile', { user })

      })

    } else {

      res.redirect('/princiLogin')

    }

  })
})




router.get('/addPrinci', (req, res) => {
  res.render('../views/admin-panel/principal/addPrinci')
})

router.get('/princi', async (req, res) => {
  let list = await userHelpers.getPrinci().then((princi) => {
    res.render('../views/admin-panel/principal/princi', { princi })
  })
})

router.post('/add-Princi', (req, res) => {


  userHelpers.addPrinci(req.body).then((response) => {
    res.redirect('/princi')
  })
})
router.get('/princiProfile',  (req, res) => {


   userHelpers.getPrinci().then((user) => {
    res.render('./admin-panel/principal/princiProfile', { user })
  })



})




router.get('/princiLogin', (req, res) => {
  if (login) {
    res.render('../views/admin-panel/principal/princiProfile')



  } else {
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

router.get('/accept-princiLeave/:id', (req, res) => {

  let status2 = { status2: 'Principal Approved ' }

  listHelper.updateLeavePrinci(req.params.id, status2).then((response) => {
    res.redirect('/princiLeaves2')
  })

})

router.get('/reject-princiLeave/:id', (req, res) => {

  let status3 = { status3: 'Principal Rejected ' }
  listHelper.updateLeavePrinci11(req.params.id, status3).then((response) => {
    res.redirect('/princiLeaves2')
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


router.get('/hrLeaves2', async (req, res) => {

  let list = await userHelpers.getFullLeave().then(async (leaves) => {
    let user1 = await userHelpers.getHr().then((user) => {
      res.render('../views/hr/hrLeaves', { leaves, user })
    })
  })


})


router.get('/accept-hrLeave/:id', (req, res) => {

  let status4 = { status4: 'HR Approved ' }

  listHelper.updateLeaveHr(req.params.id, status4).then((response) => {
    res.redirect('/hrLeaves2')
  })

})

router.get('/reject-hrLeave/:id', (req, res) => {

  let status5 = { status5: 'HR Rejected ' }
  listHelper.updateLeaveHr11(req.params.id, status5).then((response) => {
    res.redirect('/hrLeaves2')
  })

})

router.get('/hrProfile', async (req, res) => {


  let list = await userHelpers.getHr().then((user) => {
    
    
    res.render('../views/hr/hrProfile', { user })
  })



})

module.exports = router;
