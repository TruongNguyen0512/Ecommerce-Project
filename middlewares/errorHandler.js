// not found 

const notFound  = (req,res,next) =>{
    const error = new Error('Not found : ${req.originalUrl}') ;   
    res.status(404) ;  
    next(error)  ; 
}

const errorHandler =(err,req,res,next) =>{
    const status =  res.statusCode == 200 ? 500 : res.statusCode ;  
    res.status(status)  ;   
    res.json({
        message : err?.message  ,
        stack: err?.stack , 
    })
}

module.exports = {errorHandler,notFound}  