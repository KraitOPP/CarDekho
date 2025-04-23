const express=require("express")
const cors=require("cors")
const cookieParser= require('cookie-parser');
const app=express();
require('dotenv').config();
const {router:userRouter}=require('./routes/userRouter.js');
const {router:brandRouter}=require('./routes/brandRouter.js');
const {router:vehicleRouter}=require('./routes/vehicleRouter.js');
const {router:bookingRouter}=require('./routes/bookingRouter.js');
const {router:testimonialRouter}=require('./routes/testimonialRouter.js');
const {router:contactRouter}=require('./routes/contactRouter.js');
const {router:subscriberRouter}=require('./routes/subscriberRouter.js');
const {router:vehicleModelRouter}=require('./routes/vehicleModel.js');
const {router:contactInfoRouter}=require('./routes/contactInfoRouter.js');
const {router:adminRouter}=require('./routes/adminRouter.js')
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/brand",brandRouter)
app.use("/api/vehicle-model",vehicleModelRouter)
app.use("/api/vehicle",vehicleRouter)
app.use("/api/booking",bookingRouter)
app.use("/api/testimonial",testimonialRouter)
app.use("/api/contact",contactRouter)
app.use("/api/subscribe",subscriberRouter)
app.use("/api/contact-info",contactInfoRouter)
app.use("/api/admin",adminRouter);
app.listen(process.env.PORT || 8000,
    ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    }
)

