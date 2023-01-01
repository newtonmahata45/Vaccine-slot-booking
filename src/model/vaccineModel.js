const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const vaccineSchema = new mongoose.Schema({
 day: Number,
 slot1: {type:Number,default:null},
 slot2: {type:Number,default:null},
 slot3: {type:Number,default:null},
 slot4: {type:Number,default:null},
 slot5: {type:Number,default:null},
 slot6: {type:Number,default:null},
 slot7: {type:Number,default:null},
 slot8: {type:Number,default:null},
 slot9: {type:Number,default:null},
 slot10: {type:Number,default:null},
 slot11: {type:Number,default:null},
 slot12: {type:Number,default:null},
 slot13: {type:Number,default:null},
 slot14: {type:Number,default:null}

})

mondule.exports = mongoose.model( "Vaccine", vaccineSchema )