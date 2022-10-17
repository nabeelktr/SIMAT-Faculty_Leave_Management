var db=require('../config/connection')
var collections=require('../config/collections')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports={

    addlist:(list)=>{
        return new Promise(async(resolve,reject)=>{
            list.password=await bcrypt.hash(list.password,10)

        db.get().collection('list').insertOne(list).then((data) => {
            
            resolve(data._id)
        })
        
        })
    },
    getAllList:()=>{
        return new Promise(async(resolve,reject)=>{
            let lists=await db.get().collection(collections.LIST_COLLECTION).find().toArray()
            resolve(lists)
        })
    },
    deleteList:(listId)=>{
        return new Promise((resolve,reject)=>{
            console.log(ObjectId(listId));
            db.get().collection(collections.LIST_COLLECTION).deleteOne({_id:ObjectId(listId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    
    getListDetails:(listId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.LIST_COLLECTION).findOne({_id:ObjectId(listId)}).then((response)=>{
                resolve(response)
        })
    })
        
    },
    updateList:(listId,listDetails)=>{
        return new Promise(async(resolve,reject)=>{
            
            
            db.get().collection(collections.LIST_COLLECTION)
            .updateOne({_id:ObjectId(listId)},{
                $set:{
                    id:listDetails.id,
                    name:listDetails.name,
                    dob:listDetails.dob,
                    phone:listDetails.phone,
                    department:listDetails.department,
                    email:listDetails.email,
                    gender:listDetails.gender,
                    address:listDetails.address,
                    city:listDetails.city,
                    country:listDetails.country,
                    hod:listDetails.hod,
                    
                

                }
            })
            .then(async(response)=>{
                let body=await db.get().collection(collections.LIST_COLLECTION)
                .findOne({_id:ObjectId(listId)})
                response.body=body
                resolve(response)
            })
        })
    },



updatePassword:(listId,listDetails)=>{
    return new Promise(async(resolve,reject)=>{
        
        let password=await bcrypt.hash(listDetails.newPassword,10)
        db.get().collection(collections.LIST_COLLECTION)
        .updateOne({_id:ObjectId(listId)},{
            $set:{
               
                password:password
            

            }
        })
        .then(async(response)=>{
            let body=await db.get().collection(collections.LIST_COLLECTION)
            .findOne({_id:ObjectId(listId)})
            response.body=body
            resolve(response)
        })
    })
},

updateLeave:(listId,listDetails)=>{
    return new Promise(async(resolve,reject)=>{
        
        
        db.get().collection(collections.LEAVE_COLLECTION)
        .updateOne({_id:ObjectId(listId)},{

            

            $set:{
                
                status:listDetails.status,
                status1:listDetails.status1,
            }
        })
        .then(async(response)=>{
            let body=await db.get().collection(collections.LEAVE_COLLECTION)
            .findOne({id:listId})
            response.body=body
            resolve(response)
        })
    })
},

updateLeavePrinci:(listId,listDetails)=>{
    return new Promise(async(resolve,reject)=>{
        
        
        db.get().collection(collections.LEAVE_COLLECTION)
        .updateOne({_id:ObjectId(listId)},{

            

            $set:{
                
                status2:listDetails.status2
                
            }
        })
        .then(async(response)=>{
            let body=await db.get().collection(collections.LEAVE_COLLECTION)
            .findOne({id:listId})
            response.body=body
            resolve(response)
        })
    })
},
updateLeavePrinci11:(listId,listDetails)=>{
    return new Promise(async(resolve,reject)=>{
        
        
        db.get().collection(collections.LEAVE_COLLECTION)
        .updateOne({_id:ObjectId(listId)},{

            

            $set:{
                
                status3:listDetails.status3
                
            }
        })
        .then(async(response)=>{
            let body=await db.get().collection(collections.LEAVE_COLLECTION)
            .findOne({id:listId})
            response.body=body
            resolve(response)
        })
    })
},

}
