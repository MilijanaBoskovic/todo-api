const expect=require('expect');
const request=require('supertest');
const path=require('path');
const {app}=require('.\\..\\server');
const {Todo}=require('./../models/todo.js');
//const {User}=require('./../models/user');


beforeEach((done)=>
{
  Todo.remove({}).then(()=>{
    console.log('before each');
    done();});
});


describe('POST /todos', ()=>
{
  it('should create a new todo',(done)=>
  {
    var text='Test todo text';
    request(app).post('/todos').send({text}).expect(200)
    .expect((res)=>{

       expect(res.body.text).toBe(text);
     }).end((err,res)=>
     {
       if(err)
       {
         return done(err);
       }
       Todo.find().then((todos)=>{

         expect(todos.lenght).toBe(1);
         expect(todos[0].text).toBe(text);
         done();
       }).catch((e)=>{done(e);});
     })
  });
});
