exports.signUp = BigPromise( async( req , res ,next )=>{
    
    const { firstName , lastName , email , password, role } = req.body 
    //& data validtion from frontend 

    if(!email || !firstName || !lastName || !password ) {
        validationErrorWithData(res, "All feilds are required", req.body)
       return next( new CustomError(404 , false , "please send all details" ))
    }

    //& Creating a user in the database 
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(new CustomError(400, false, "Email already in use!!!"));
    }

    const user = await User.create({
        firstName ,
        lastName ,
        email ,
        password
    }).catch((error )=> {
        ErrorResponse(res, "An Error Occured while attempting to create user: ", error )
        return; // Add this line to exit the function early
    })
    if (!user) {
        return; // Add this line to prevent calling cookieToken if user is undefined
    } 
    
    //& sending a token after user creation 
    cookieToken(user , res);

})