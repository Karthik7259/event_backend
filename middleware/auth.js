import jwt from 'jsonwebtoken';

const authuser =async (req, res, next) => {
    try{
        const {token} = req.headers;    
        if(!token){
            return res.status(401).json({error:"Access denied."});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    }catch(err){
        console.log(err);
        res.status(400).json({success:false, error:"Invalid token"});
    }
};

export default authuser;