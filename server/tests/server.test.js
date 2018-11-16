const expect=require('expect');
const request=require('supertest');
const path=require('path');

const {app}=require('.\\..\\server');// relative path, then one directory back
const {Todo}=require('.\\..\\models\\todo');
const {ObjectID}=require('mongodb');
//const {User}=require('./../models/user');

const todos=[
  { _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  },
];


before((done)=>
{
  Todo.remove({}).then(()=>{
    done();
});
});
beforeEach((done)=>
{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
}).then(()=>done());
});

describe('POST /todos', ()=>
{
  it('should create a new todo',(done)=>
  {
    let text='Test todo text';
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

         expect(todos.length).toBe(3);
         expect(todos[0].text).toBe(text);

         done();
       }).catch((e)=>{done(e);});
     })
  });
// it('should not create to do with invalid body data',(done)=>
// {
//   request(app).post('/todos').send({}).expect(400)
//   .end((err,res)=>
//   {
//     if(err)
//     {
//       return done(err);
//     }
//     Todo.find().then((todos)=>{
//       console.log(typeof todos);
//       expect(todos.length).toBe(1);
//       done();
//     }).catch((e)=>{done(e);});
//   });
// });
});

describe('GET /todos',()=>{

it('should get all todos',(done)=>
{
  request(app).get('/todos').expect(200).expect((res)=>
  {
    console.log(typeof res.body.todos);
    console.log(res.body.todos);
    expect(res.body.todos.length).toBe(1);
  }).end(done);
});

describe('GET /todos/:id',()=>{

it('should return todo doc',(done)=>
{
    request(app).get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
});

it('should return 404 if todo not found',(done)=>
{
  var validIdButNotExistsInDatabase= new ObjectID();
  request(app).get(`/todos/${validIdButNotExistsInDatabase.toHexString()}`)
    .expect(404)
    .end(done);

});

it('should return 404 for non object ids',(done)=>
{
  var invalidId= '123';
  request(app).get(`/todos/${invalidId}`)
    .expect(404)
    .end(done);

});

});




});
