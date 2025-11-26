import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    try {
        const {token} = req.headers;
        console.log(token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(token_decoded);
        if(token_decoded.id !== process.env.admin_email){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export default adminAuth;