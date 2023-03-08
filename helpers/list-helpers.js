var db=require('../config/connection')
var collections=require('../config/collections')
const bcrypt=require('bcrypt')
const { LIST_COLLECTION } = require('../config/collections')
const { LEAVE_COLLECTION } = require('../config/collections')
const {HOD} = require('../config/collections')
const {PRINCIPAL} = require('../config/collections')
const {HR} = require('../config/collections')
const { ObjectId } = require('mongodb')
const async = require('hbs/lib/async')


module.exports = {

    addlist: (list) => {
        return new Promise(async (resolve, reject) => {
            list.password = await bcrypt.hash(list.password, 10)

            db.get().collection('list').insertOne(list).then((data) => {

                resolve(data._id)
            })

        })
    },
    
    deleteList: (listId) => {
        return new Promise((resolve, reject) => {
            console.log(ObjectId(listId));
            db.get().collection(collections.LIST_COLLECTION).deleteOne({ _id: ObjectId(listId) }).then((response) => {
                resolve(response)
            })
        })
    },

    
   

    updateLeave: (listId, status, comment) => {
        return new Promise(async (resolve, reject) => {


            db.get().collection(collections.LEAVE_COLLECTION)
                .updateOne({ _id: ObjectId(listId) }, {



                    $set: status[2].hrStatus!==undefined?{

                        // hodStatus: status[0].hodStatus,
                        // princiStatus: status[1].princiStatus,
                        hrStatus: status[2].hrStatus,
                        hrComment: comment
                

                    }:status[1].princiStatus!==undefined?{

                        // hodStatus: status[0].hodStatus,
                        // princiStatus: status[1].princiStatus,
                        princiStatus: status[1].princiStatus,
                        princiComment: comment
                

                    }:{
                       hodStatus: status[0].hodStatus,
                        hodComment: comment
                
                    }
                })
                .then(async (response) => {
                    let body = await db.get().collection(collections.LEAVE_COLLECTION)
                        .findOne({ id: listId })
                    response.body = body
                    resolve(response)
                })
        })
    },
   
 getLeaveDetails: (leaveId)=>{
        return new Promise(async (resolve,reject)=>{
            db.get().collection(collections.LEAVE_COLLECTION)
                .findOne({_id: ObjectId(leaveId)}).then((leaves)=>{
                    date1 = JSON.stringify(leaves.fromdate)
                    date2 = JSON.stringify(leaves.todate)
                    leaves.fromdate = date1.slice(1,11)
                    leaves.todate = date2.slice(1,11)
                    
                resolve(leaves)
            })
        })
    },

monthCheck: (userId,month)=>{
    return new Promise((resolve,reject)=>{
        
        console.log(month)
        db.get().collection(collections.LEAVE_COLLECTION).aggregate(
            [{
               $match : {
                id : userId ,
                
                $and: [
                    {
                        $expr: {
                            $eq: [{ $month: "$fromdate" }, parseInt(month)]
                        }
                    },
                    {
                        $expr: {
                            $eq: [{ $year: "$fromdate" }, new Date().getFullYear()]
                        }
                    },
                    {
                        hrStatus: true
                    }
                ]

          
        }}]).toArray().then((response)=>{
              console.log(response)
              resolve(response)
          })
    })

},


getPermissionList: (dept)=>{
    return new Promise((resolve, reject) => {
        db.get().collection(collections.PERMISSION).find({department: dept}).toArray().then((list)=>{
            resolve(list)
        })
    })
}
}


