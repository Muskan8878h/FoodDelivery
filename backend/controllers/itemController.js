import itemModal from '../modals/itemModal.js';

export const createItem=async(req,res)=>{
    try{
        const {name,description,category,price,rating,hearts}=req.body;
        const imageUrl=req.file ? `/uploads/${req.file.filename}` : " ";
        
        const total=Number(price)*1;

        const newItem=new itemModal({
            name,
            description,
            category,
            price,
            rating,
            hearts: hearts || 0,
            imageUrl,
            total
        })

        const saved=await newItem.save();
        res.status(201).json(saved);
    }
    catch(error){
        if(error.code===11000){
            res.status(400).json({message: 'Item name already Exits'})
        }
    }
}



// get function to get all items
export const getItems=async(_req,res,next)=>{
    try{
        const items=await itemModal.find().sort({createdAt:-1});
        const host=`${_req.protocol}://${_req.get('host')}`; 

        const withFullUrl=items.map(i=>({
            ...i.toObject(),
            imageUrl:i.imageUrl ? host+i.imageUrl : ''
        }));
        res.json(withFullUrl)
    }
    catch(err){
        next(err);
    }
}


// delete function to delete items
export const deleteItem=async(req,res,next)=>{
    try{
        const removed=await itemModal.findByIdAndDelete(req.params.id);
        if(!removed) return res.status(404).json({message:"Item not found"});
        res.status(204).end();
    }
    catch(err){
        next(err);
    }
}
