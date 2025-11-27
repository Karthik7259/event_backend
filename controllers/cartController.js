

// add product to user cart

const addToCart = async (req, res) => {
    try{


    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    }

};


//  update product in user cart

const updateCart = async (req, res) => {
    try{

        
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    }

};


// get user cart 

const getUserCart = async (req, res) => {
    try{

        
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    }

};


export {addToCart,updateCart,getUserCart};