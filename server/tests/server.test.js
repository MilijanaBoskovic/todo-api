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
    text: 'Second test todo',
    completed: true,
    completedAt: 333
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


describe('DELETE /todos/:id',()=>{

it('should remove todo',(done)=>
{
  var hexId=todos[1]._id.toHexString();
  request(app).delete(`/todos/${hexId}`)
  .expect(200)
  .expect((res)=>
  {
    expect(res.body.todo._id).toBe(hexId);
  }).end((err,res)=>{
    if(err)
    {
      return done(err);
    }

    Todo.findById(hexId).then((todo)=>
    {
      expect(todo).toNotExist();
      done();
    }).catch((e)=>{
      done(e);
    });
  });
});

it('should return 404 if todo not found',(done)=>
{
  var validIdButNotExistsInDatabase= new ObjectID();
  request(app).delete(`/todos/${validIdButNotExistsInDatabase.toHexString()}`)
    .expect(404)
    .end(done);
});

it('should return 404 if object id is invalid',(done)=>
{
  var invalidId= '123';
  request(app).delete(`/todos/${invalidId}`)
    .expect(404)
    .end(done);
});

});


describe('PATCH /todos/:id',()=>{


it('should update the todo',(done)=>
{
  var id=todos[0]._id.toHexString();
  var text='This should be the new text';

  request(app).patch(`/todos/${id}`)
  .send({
      completed:true,
      text:text
  })
  .expect(200)
  .expect((res)=>
  {
    expect(res.body.todo.text).toBe(text);
    expect(res.body.todo.completed).toBe(true);
    expect(res.body.todo.completedAt).toBeA('number');
  })
  .end(done);

});

it('should clear completedAt when todo is not completed',(done)=>
{
  var id=todos[1]._id.toHexString();
  var text='This should be the new text';
  request(app).patch(`/todos/${id}`)
  .send({
      completed:false,
      text:text
  })
  .expect(200)
  .expect((res)=>{
    expect(res.body.todo.text).toBe(text);
    expect(res.body.todo.completed).toBe(false);
    expect(res.body.todo.completedAt).toNotExist();
  }).end(done);

});




});
});
