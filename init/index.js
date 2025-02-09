const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');

main()
    .then(() => {
        console.log("Connecting successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

const initDB = async()=>{
   await listing.deleteMany({});
   initData.data = initData.data.map((obj) =>({...obj,owner : "679d1d174fe6502de27f63dc"}));
   await listing.insertMany(initData.data);
   console.log('done');
}
initDB();