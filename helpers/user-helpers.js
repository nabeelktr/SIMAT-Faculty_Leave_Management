var db=require('../config/connection')
var collections=require('../config/collections')
const bcrypt=require('bcrypt')
const { LIST_COLLECTION } = require('../config/collections')
const { LEAVE_COLLECTION } = require('../config/collections')
const {HOD} = require('../config/collections')
const {PRINCIPAL} = require('../config/collections')
const { ObjectId } = require('mongodb')
const async = require('hbs/lib/async')

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
                        
                        resolve({status:false})
                        
                    }
                })
            }else{
            
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

    getLeaves:(user)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.LEAVE_COLLECTION).find({department:user}).toArray().then((leaves)=>{
            
                resolve(leaves)
            })
        })
        
    },

    getFullLeave:()=>{
        return new Promise((resolve,reject)=>{
            
              db.get().collection(collections.LEAVE_COLLECTION).find().toArray().then((leaves)=>{
            
            resolve(leaves)
              })
        
    })
    
    },

    //hod
    
    addHod:(hod)=>{
          
        return new Promise(async(resolve,reject)=>{
          
            
            hod.password=await bcrypt.hash(hod.password,10)
        db.get().collection('hod').insertOne(hod).then((data) => {
            
            
            
            resolve(data)
            
        })
        
        })
    },

    getHod:(user)=>{
        return new Promise((resolve,reject)=>{
            
           db.get().collection(collections.HOD).find().toArray().then((leaves)=>{
            
            resolve(leaves)
        })
    })
    
    },

    getHod1:(user)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.HOD).find({id:user}).toArray().then((hod)=>{
            
                resolve(hod)
            })
        })
        
    },

    HodDoLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            
            let response={}
            
            let user=await db.get().collection(collections.HOD).findOne({id:userData.id})
            if (user){
              bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        
                        response.status= true
                        response.user= user
                        
                        
                        
                        resolve(response)
                        
                        

                    }else{
                        
                        resolve({status:false})
                        
                    }
                })
            }else{
            
            resolve({status:false})
            }

        })
    },


//princi
PrinciDoLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        
        let response={}
        
        let user=await db.get().collection(collections.PRINCIPAL).findOne({id:userData.id})
        if (user){
          bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    
                    response.status= true
                    response.user= user
                    
                    
                    
                    resolve(response)
                    
                    

                }else{
                    
                    resolve({status:false})
                    
                }
            })
        }else{
        
        resolve({status:false})
        }

    })
},

addPrinci:(princi)=>{
          
    return new Promise(async(resolve,reject)=>{
      
        
        princi.password=await bcrypt.hash(princi.password,10)
    db.get().collection('principal').insertOne(princi).then((data) => {
        
        
        
        resolve(data)
        
    })
    
    })
},

getPrinci:(user)=>{
    return new Promise((resolve,reject)=>{
        
       db.get().collection(collections.PRINCIPAL).findOne().then((princi)=>{
        
        resolve(princi)
    })
})

},

}