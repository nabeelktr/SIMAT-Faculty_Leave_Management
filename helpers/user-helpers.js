var db=require('../config/connection')
var collections=require('../config/collections')
const bcrypt=require('bcrypt')
const { LIST_COLLECTION } = require('../config/collections')
const { LEAVE_COLLECTION } = require('../config/collections')
const { ObjectId } = require('mongodb')

module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            
            let response={}
            
            let user=await db.get().collection(collections.LIST_COLLECTION).findOne({id:userData.id})
            if (user){
              bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        
                        response.status= true
                        response.user= user
                        
                        
                        
                        resolve(response)
                        
                        

                    }else{
                        console.log('logn fail')
                        resolve({status:false})
                        
                    }
                })
            }else{
            console.log('login fail');
            resolve({status:false})
            }

        })
    },

    passwordCheck:(userId,userdata)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user=await db.get().collection(collections.LIST_COLLECTION).findOne({_id:ObjectId(userId)})
                
                console.log(userdata);
            
                console.log('second');
            bcrypt.compare(userdata.password,user.password).then((status)=>{
                if(status){
                    response.status= true
                    console.log('heh');
                response.user=user
                resolve(response)
                
                }else{
                    resolve({status:false})
                }
                

            })
       
            
        })
    
    },
    addLeave:(Leaves)=>{
          
        return new Promise(async(resolve,reject)=>{
          
            
            
        db.get().collection('Leaves').insertOne(Leaves).then((data) => {
            

            
            resolve(data)
            
        })
        
        })
    },
    getAllLeave:(user)=>{
        return new Promise((resolve,reject)=>{
            
           db.get().collection(collections.LEAVE_COLLECTION).find({id:user}).toArray().then((leaves)=>{
            
            resolve(leaves)
        })
    })
    
    },

    getLeaves:()=>{
        return new Promise(async(resolve,reject)=>{
            let leaves=await db.get().collection(collections.LEAVE_COLLECTION).find().toArray()
            resolve(leaves)
        })
    }
}