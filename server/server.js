const express=require('express');
const bodyParser=require('body-parser');
const path = require('path');
const {ObjectID}=require('mongodb');
const _=require('lodash');


var {mongoose}= require('./db/mongoose.js')
var {Todo} =require('./models/todo.js');
var {User} =require('./models/user.js');


var app= express();

app.use(bodyParser.json());
const port=process.env.PORT || 3000;


app.post('/todos',(req,res)=>
{
  console.log(req.body);

  var todo= new Todo({    text : req.body.text   });

  todo.save().then( (doc)=>{ res.send(doc); }, (errorMessage)=>{res.status(400).send(errorMessage)});

});

app.get('/todos',(req,res)=>
{
  Todo.find().then((todos)=>{ res.send({todos});},(e)=>{res.status(400).send(e)});
});

app.get('/todos/:id',(req,res)=>
{
  var id=req.params.id;
  if(!ObjectID.isValid(id))
  {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{

    if(!todo)
    {
      return res.status(404).send();
    }

    res.status(200).send({todo});//without parenthis we cant use in testing todo.text
    done();
  }).catch((e)=>
  {
    res.status(400).send();
  });

});


app.delete('/todos/:id',(req,res)=>{

  var id=req.params.id;

  if(!ObjectID.isValid(id))
  {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>
  {
    if(!todo)
    {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.patch('/todos/:id',(req,res)=>{

  var id=req.params.id;
  var body= _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id))
  {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed)
  {
    body.completedAt=new Date().getTime();
  }
  else
  {
    body.completed=false;
    body.completedAt=null;
  }

  Todo.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo)=>{
    if(!todo)
    {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{ res.status(400).send()});

});


app.listen(port,()=>{
  console.log(`Server started on port ${port}`);
});

module.exports={app};
