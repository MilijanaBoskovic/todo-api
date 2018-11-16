var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
if(process.env.PORT)
  mongoose.connect(process.env.MONGODB_URI );
else {
  mongoose.connect('mongodb://localhost:27017/TodoApp');
}

module.exports ={ mongoose};
