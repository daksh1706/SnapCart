import mongoose from "mongoose";

export interface IGrocery{
    _id ?: mongoose.Types.ObjectId,
    name: string,
    category : string,
    size :string,
    description ?: string
    originalprice : string,
    sellingprice :string,
    unit : string,
    image : string,
    createdAt ?: Date,
    updatedAt ?: Date
}

const grocerySchema = new mongoose.Schema<IGrocery>({
    name:{
        type : String,
        required : true
    },
    category:{
        type : String,
        enum :[
            "Fruits & Vegetables",
            "Dairy",
            "Rice, Atta & Grains",
            "Snacks & Biscuits",
            "Spices & Masala",
            "Beverages & Drinks",
            "Personal Care",
            "Household Essential",
            "Instant & Packages Food",
            "Baby & Pet Care"
        ],
        required:true
    },
    originalprice:{
        type : String,
        required : true
    },
    sellingprice:{
        type : String,
        required : true
    },
    unit:{
        type : String,
        required : true,
        enum:[
            "kg","gm","liter","ml","piece","pack"
        ]
    },
    image:{
        type : String,
        required : true
    },
    size:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    }
},{
    timestamps :true
})

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery",grocerySchema)

export default Grocery