import mongoose from 'mongoose';

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://muskan8878h_db_user:Muskan@cluster0.a56bdh2.mongodb.net/?retryWrites=true&w=majority&appName=Foody ')
    .then(()=>console.log("DB connected"));
}
