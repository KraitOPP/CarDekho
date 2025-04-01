const express=require("express")
const cors=require("cors")
const cookieParser= require('cookie-parser');
const app=express();
require('dotenv').config();
const {router:userRouter}=require('./routes/userRouter.js');
const {router:brandRouter}=require('./routes/brandRouter.js');
const {router:vehicleRouter}=require('./routes/vehicleRouter.js')

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/user",userRouter)
app.use("/brand",brandRouter)
app.use("/vehicle",vehicleRouter)

app.listen(process.env.PORT || 8000,
    ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    }
)

