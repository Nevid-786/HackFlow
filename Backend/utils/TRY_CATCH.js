

const TRY_CATCH = (handler) =>{
    return async(req,res,next)=>{
        try {
            await handler(req,res,next)
        } catch (error) {
            console.log("error",error);
            res.status(400).json({
                message:error?.message||"Error in try catch"
            })
        }
    }
} 

export default TRY_CATCH;
