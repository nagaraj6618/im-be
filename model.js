const mongoose = require('mongoose')
const modelSchema = new mongoose.Schema({
   count:{
      type:Number,
      require:true,
      default:1
   },
   message:{
      type:Array,
      default:[]
   }
})

module.exports = mongoose.model('count',modelSchema);