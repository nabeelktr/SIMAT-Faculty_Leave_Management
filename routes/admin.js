var express = require('express');
var router = express.Router();
var listHelper = require('../helpers/list-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./admin-panel/index', {});
});

router.get('/adminLogin', (req, res) => {
  res.render('../views/admin-panel/adminlogin')
})

router.get('/list', (req, res) => {
  
    res.render('../views/admin-panel/addList')
  
  
})


router.get('/viewList', (req, res) => {
  listHelper.getAllList().then((lists)=> {
  res.render('../views/admin-panel/admin',{lists})
  })
})

router.get('/delete-list/:id',(req,res)=>{
  let listId=req.params.id
  listHelper.deleteList(listId).then((response)=>{
    res.redirect('/viewList')
  })
})

router.get('/edit-list/:id',async (req,res)=>{
  let list=await listHelper.getListDetails(req.params.id)
  console.log(list);
  
    res.render('./admin-panel/editList',{list})
  })





// post

router.post('/login', (req, res) => {
  
  let user= req.body
  if(user.name==='admin'&& user.password==='123')
  listHelper.getAllList().then((lists)=> {
    res.render('../views/admin-panel/admin',{lists})
    })
    else {
      res.redirect('/adminLogin')
    }
})

router.post('/addList', (req, res) => {


  listHelper.addlist(req.body).then((response)=>{
    res.redirect('/viewList')
  })
})
  router.post('/edit-list/:id', (req, res) => {


    listHelper.updateList(req.params.id,req.body).then((response)=>{
      res.redirect('/viewList')
    })
  
})



module.exports = router;
