var express=require('express');
var bodyParser=require('body-parser');


var {mongoose}= require('./db/mongoose.js')
var {Todo} =require('./models/todo.js');
var {User} =require('./models/user.js');


var app= express();

app.use(bodyParser.json());
app.post('/todos',(req,res)=>
{
  console.log(req.body);

  var todo= new Todo({    text : req.body.text   });

  todo.save().then( (doc)=>{ res.send(doc); }, (errorMessage)=>{res.status(400).send(errorMessage)});

});


app.listen(3000,()=>{
  console.log('Server started on port 3000');
});

module.exports={app};
