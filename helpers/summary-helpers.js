var db = require('../config/connection')
var collections = require('../config/collections')
const { LIST_COLLECTION } = require('../config/collections')
const { LEAVE_COLLECTION } = require('../config/collections')
const { ObjectId } = require('mongodb')
const async = require('hbs/lib/async')


module.exports = {

    getTotalLeave: (year,leavetype) => {
        return new Promise(async (resolve, reject) => {
            let leave = await db.get().collection(collections.LEAVE_COLLECTION).aggregate(
                [
                    {
                        $match: {
                            
                            princiStatus : true,
                            leavetype: leavetype,
                            $expr: {
                            $cond: [
                                { $eq: ["$leaveDuration", "fullDay"] },
                                { $eq: [{ $year: "$fromdate" }, year] },
                                { $eq: [{ $year: "$halfdaydate" },year] }
                              ]
                            }
                               
                            

                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalLeaves: {
                                $sum: {
                                    $toDecimal: "$nofdays"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalLeaves: 1
                        }
                    }
                ]
            ).toArray()
            
            resolve(leave.length ? leave[0].totalLeaves : 0)


        })

    },

    getDeptLeave: (year,leavetype,dept) => {
        return new Promise(async (resolve, reject) => {
            let leave = await db.get().collection(collections.LEAVE_COLLECTION).aggregate(
                [
                    {
                        $match: {
                            department : dept,
                            princiStatus : true,
                            leavetype: leavetype,
                            $expr: {
                            $cond: [
                                { $eq: ["$leaveDuration", "fullDay"] },
                                { $eq: [{ $year: "$fromdate" }, year] },
                                { $eq: [{ $year: "$halfdaydate" },year] }
                              ]
                            }
                               
                            

                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalLeaves: {
                                $sum: {
                                    $toDecimal: "$nofdays"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalLeaves: 1
                        }
                    }
                ]
            ).toArray()
            
            resolve(leave.length ? leave[0].totalLeaves : 0)


        })

    },
    getFacLeave: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.LIST_COLLECTION).findOne({ id: user}).then((fac)=>{
                
            if(fac){
            db.get().collection(collections.LEAVE_COLLECTION).find({ id: user, princiStatus: true }).sort({timestamp: -1}).toArray().then(async (leaves) => {


                for (i = 0; i < leaves.length; i++) {
                    if( leaves[i].leaveDuration == "fullDay"){
                        date1 = JSON.stringify(leaves[i].fromdate)
                        date2 = JSON.stringify(leaves[i].todate)
                        leaves[i].fromdate = date1.slice(1,11)
                        leaves[i].todate = date2.slice(1,11)
                        }
                        else if( leaves[i].leaveDuration == "halfDay"){
                            date1 = JSON.stringify(leaves[i].halfdaydate);
                            leaves[i].halfdaydate = date1.slice(1,11)
                        }
                        
    
                }
                console.log(leaves)
                resolve(leaves[0]?leaves:[{name:fac.name, department:fac.department}])
            })
        }
        else{
            resolve("empty")
        }
    
        })
        })

    },

    getSingleLeave: (serialNo) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.LEAVE_COLLECTION)
                .findOne({ serialNo: serialNo }).then((leaves) => {
                    if(leaves){
                    if ( leaves.leaveDuration == "fullDay") {
                        date1 = JSON.stringify(leaves.fromdate)
                        date2 = JSON.stringify(leaves.todate)
                        leaves.fromdate = date1.slice(1, 11)
                        leaves.todate = date2.slice(1, 11)
                    }
                    else if ( leaves.leaveDuration == "halfDay") {
                        date1 = JSON.stringify(leaves.halfdaydate);
                        leaves.halfdaydate = date1.slice(1, 11)


                    }
                }

                    resolve(leaves)
                })
        })
    },
}