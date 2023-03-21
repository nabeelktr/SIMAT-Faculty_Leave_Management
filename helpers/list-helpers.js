var db = require('../config/connection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { LIST_COLLECTION } = require('../config/collections')
const { LEAVE_COLLECTION } = require('../config/collections')
const { HOD } = require('../config/collections')
const { PRINCIPAL } = require('../config/collections')
const { HR } = require('../config/collections')
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



                    $set:  status[1].princiStatus !== undefined ? {

                        
                        princiStatus: status[1].princiStatus,
                        princiComment: comment


                    } : {
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

    getLeaveDetails: (leaveId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.LEAVE_COLLECTION)
                .findOne({ _id: ObjectId(leaveId) }).then((leaves) => {
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

                    resolve(leaves)
                })
        })
    },

    monthCheck: (userId, month) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collections.LEAVE_COLLECTION).aggregate(
                [{
                    $match: {
                        id: userId,

                        $and: [
                            {
                                leaveDuration: "fullDay"
                            },
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
                                princiStatus: true
                            }

                        ]


                    }
                }]).toArray().then((response) => {
                    
                    resolve(response)
                })
        })

    },

    halfmonthCheck: (userId, month) => {
        return new Promise(async (resolve, reject) => {

            console.log(month)
            let nod = await db.get().collection(collections.LEAVE_COLLECTION).aggregate(
                [{
                    $match: {
                        id: userId,

                        $and: [
                            {
                                princiStatus: true
                            },
                            {
                                leaveDuration: "halfDay"
                            },
                            {
                                $expr: {
                                    $eq: [{ $month: "$halfdaydate" }, parseInt(month)]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [{ $year: "$halfdaydate" }, new Date().getFullYear()]
                                }
                            }
                        ]


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

                ]).toArray()
            
            resolve(nod)
        })


    },


    getPermissionList: (dept) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PERMISSION).find({ department: dept }).toArray().then((list) => {
                resolve(list)
            })
        })
    },
    editPermissionList: (listId, action) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PERMISSION).updateOne({ _id: ObjectId(listId) }, {
                $set:
                    { status: action }
            }).then(() => {
                resolve()
            })
        })
    },
    updateFacultyPermission: (id) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collections.LIST_COLLECTION).updateOne({ id: id }, {
                $set: {

                    permission: true
                }
            }).then(() => {

                resolve()



            })
        })
    },
    updateFacultyPermission2: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.LIST_COLLECTION).updateOne({ _id: ObjectId(id) }, {
                $set: {
                    permission: false
                }
            }).then(() => {
                db.get().collection(collections.LIST_COLLECTION).findOne({ _id: ObjectId(id) }).then((data) => {
                    db.get().collection(collections.PERMISSION).deleteMany({ id: data.id }).then(() => {
                        resolve()
                    })
                })
            })

        })
    }
}


