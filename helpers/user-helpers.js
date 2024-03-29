var db = require('../config/connection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
const uuid = require('uuid');
const { LIST_COLLECTION } = require('../config/collections')
const { LEAVE_COLLECTION } = require('../config/collections')
const { HOD } = require('../config/collections')
const { PRINCIPAL } = require('../config/collections')
const { HR } = require('../config/collections')
const { PERMISSION } = require('../config/collections')

const { ObjectId } = require('mongodb')
const async = require('hbs/lib/async')

module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}

            let user = await db.get().collection(collections.LIST_COLLECTION).findOne({ id: userData.id })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        response.status = true
                        response.user = user



                        resolve(response)



                    } else {

                        resolve({ status: false })

                    }
                })
            } else {

                resolve({ status: false })
            }

        })
    },
    getUser:(_id)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collections.LIST_COLLECTION).findOne({_id: ObjectId(_id) }).then((data)=>{
                resolve(data)
            })
        })
    },

    passwordCheck: (userId, userdata) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collections.LIST_COLLECTION).findOne({ _id: ObjectId(userId) })

            console.log(userdata);

            console.log('second');
            bcrypt.compare(userdata.password, user.password).then((status) => {
                if (status) {
                    response.status = true
                    console.log('heh');
                    response.user = user
                    resolve(response)

                } else {
                    resolve({ status: false })
                }


            })


        })

    },
    addLeave: (Leaves) => {

        return new Promise((resolve, reject) => {
            const uuidStr = uuid.v4();
            Leaves.timestamp = new Date();
            Leaves.serialNo = 'SPT'+uuidStr.substr(0, 8);
            Leaves.finalarrangement = Leaves.finalarrangement.split('\r\n').filter((i) => i
            )
            if (Leaves.leaveDuration === "fullDay") {
                Leaves.fromdate = new Date(Leaves.fromdate);
                Leaves.todate = new Date(Leaves.todate);
                delete Leaves.halfdaydate;
                delete Leaves.session;
              } else {
                Leaves.halfdaydate = new Date(Leaves.halfdaydate);
                delete Leaves.fromdate;
                delete Leaves.todate;
              }

            db.get().collection('Leaves').insertOne(Leaves).then((data) => {



                resolve(data)

            })


        })
    },



    getUserLeave: (user) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collections.LEAVE_COLLECTION).find({ id: user }).sort({timestamp: -1}).toArray().then(async (leaves) => {


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

                resolve(leaves)
            })
        })

    },

    getLeaves: (user) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.LEAVE_COLLECTION).find({ department: user }).sort({timestamp: -1}).toArray().then((leaves) => {
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

                resolve(leaves)
            })
        })

    },

    getFullLeave: () => {
        return new Promise((resolve, reject) => {

            db.get().collection(collections.LEAVE_COLLECTION).aggregate([
                {
                    $match: {
                        hodStatus: true
                    }
                }
            ]).sort({timestamp: -1}).toArray().then((leaves) => {
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

                resolve(leaves)
            })

        })

    },

    //hod

    addHod: (hod) => {

        return new Promise(async (resolve, reject) => {


            hod.password = await bcrypt.hash(hod.password, 10)
            db.get().collection('hod').insertOne(hod).then((data) => {



                resolve(data)

            })

        })
    },

    getHod: (user) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collections.HOD).find().toArray().then((leaves) => {

                resolve(leaves)
            })
        })

    },

    getHod1: (user) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.HOD).find({ id: user }).toArray().then((hod) => {

                resolve(hod)
            })
        })

    },

    HodDoLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}

            let user = await db.get().collection(collections.HOD).findOne({ id: userData.id })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        response.status = true
                        response.user = user



                        resolve(response)



                    } else {

                        resolve({ status: false })

                    }
                })
            } else {

                resolve({ status: false })
            }

        })
    },


    //princi
    PrinciDoLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}

            let user = await db.get().collection(collections.PRINCIPAL).findOne({ id: userData.id })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        response.status = true
                        response.user = user



                        resolve(response)



                    } else {

                        resolve({ status: false })

                    }
                })
            } else {

                resolve({ status: false })
            }

        })
    },

    addPrinci: (princi) => {

        return new Promise(async (resolve, reject) => {


            princi.password = await bcrypt.hash(princi.password, 10)
            db.get().collection('principal').insertOne(princi).then((data) => {



                resolve(data)

            })

        })
    },

    getPrinci: () => {
        return new Promise(async (resolve, reject) => {
            let princi1 = await db.get().collection(collections.PRINCIPAL).findOne().then((princi) => {
                resolve(princi)
            })
        })
    },




    //HR

    addHr: (hr) => {

        return new Promise(async (resolve, reject) => {


            hr.password = await bcrypt.hash(hr.password, 10)
            db.get().collection('hr').insertOne(hr).then((data) => {

                resolve(data)
            })

        })
    },


    getHr: () => {
        return new Promise(async (resolve, reject) => {
            let hr1 = await db.get().collection(collections.HR).findOne().then((hr) => {
                resolve(hr)

            })
        })
    },


    HrDoLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}

            let user = await db.get().collection(collections.HR).findOne({ id: userData.id })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        response.status = true
                        response.user = user



                        resolve(response)



                    } else {

                        resolve({ status: false })

                    }
                })
            } else {

                resolve({ status: false })
            }

        })
    },


    getTotalLeave: (userId) => {
        return new Promise(async (resolve, reject) => {
            let leave = await db.get().collection(collections.LEAVE_COLLECTION).aggregate(
                [
                    {
                        $match: {
                            id: userId,
                            princiStatus : true,
                            leavetype: "Casual Leave",
                            $expr: {
                            $cond: [
                                { $eq: ["$leaveDuration", "fullDay"] },
                                { $eq: [{ $year: "$fromdate" }, new Date().getFullYear()] },
                                { $eq: [{ $year: "$halfdaydate" }, new Date().getFullYear()] }
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
    getTotalDutyLeave: (userId) => {
        return new Promise(async (resolve, reject) => {
            let leave = await db.get().collection(collections.LEAVE_COLLECTION).aggregate(
                [
                    {
                        $match: {
                            id: userId,
                            princiStatus : true,
                            leavetype: "Duty Leave",
                            $expr: {
                            $cond: [
                                { $eq: ["$leaveDuration", "fullDay"] },
                                { $eq: [{ $year: "$fromdate" }, new Date().getFullYear()] },
                                { $eq: [{ $year: "$halfdaydate" }, new Date().getFullYear()] }
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


    getListDetails: (listId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.LIST_COLLECTION).findOne({ _id: ObjectId(listId) }).then((response) => {
                resolve(response)
            })
        })

    },

    updateList: (listId, listDetails) => {
        return new Promise(async (resolve, reject) => {


            db.get().collection(collections.LIST_COLLECTION)
                .updateOne({ _id: ObjectId(listId) }, {
                    $set: {
                        id: listDetails.id,
                        name: listDetails.name,
                        dob: listDetails.dob,
                        phone: listDetails.phone,
                        department: listDetails.department,
                        email: listDetails.email,
                        gender: listDetails.gender,
                        address: listDetails.address,
                        city: listDetails.city,
                        country: listDetails.country,
                        hod: listDetails.hod,



                    }
                })
                .then(async (response) => {
                    let body = await db.get().collection(collections.LIST_COLLECTION)
                        .findOne({ _id: ObjectId(listId) })
                    response.body = body
                    resolve(response)
                })
        })
    },



    updatePassword: (listId, listDetails) => {
        return new Promise(async (resolve, reject) => {

            let password = await bcrypt.hash(listDetails.newPassword, 10)
            db.get().collection(collections.LIST_COLLECTION)
                .updateOne({ _id: ObjectId(listId) }, {
                    $set: {

                        password: password


                    }
                })
                .then(async (response) => {
                    let body = await db.get().collection(collections.LIST_COLLECTION)
                        .findOne({ _id: ObjectId(listId) })
                    response.body = body
                    resolve(response)
                })
        })
    },
    getAllList: () => {
        return new Promise(async (resolve, reject) => {
            let lists = await db.get().collection(collections.LIST_COLLECTION).find().toArray()
            resolve(lists)
        })
    },

    unlockRequest:(data)=>{
        return new Promise((resolve, reject) => {

           data.date = new Date();

            db.get().collection('permission').insertOne(data).then((data) => {



                resolve(data)

            })


        })
    },

    getPermission:(userId)=>{
        return new Promise( (resolve, reject) => {
             db.get().collection(collections.PERMISSION).find({id: userId}).sort({date: -1}).toArray().then((data) => {
                
                resolve(data[0])
            })
        })
    }

    
}