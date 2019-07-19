const express= require('express');

const bookRouter=express.Router();
const bodyParser=express.json();
const uuid=require('uuid/v4');
const logger=require('../logger');

const books=[
  {
    id:1,
    title:'ChimCharee',
    url:'http//:stuffsandthings',
    rating:3,
    description:'The Book Was Ok'
  }
];


bookRouter
  .route('/bookmarks')  
  .get((req,res)=>{
    res.json(books);
  })

  .post(bodyParser,(req,res)=>{

    const{title,url,rating,description}=req.body;

    if(!title){
      return res
        .status(400)
        .send('title is required');
    }
    if(!url){
      logger.error('url is required');
      return res
        .status(400)
        .send('url Is Required');
    }
    if(!rating){
      logger.error('rating is required');
      return res
        .status(400)
        .send('rating is required');
    }
    if(!description){
      logger.error('description is required');
      return res
        .status(400)
        .send('description is required');
    }

    const id=uuid();
    const book={
      id,
      title,
      url,
      rating,
      description
    };

    books.push(book);
    logger.info(`Book With id ${id} created`);

    res
      .status(201)
      .location(`http://localhost8080/card/${id}`)
      .json(book);

    
  });

bookRouter
  .route('/bookmarks/:id')
  .get((req,res)=>{
    const { id } = req.params;
    const book = books.find(b => b.id == id);

    
    if (!book) {
      logger.error(`Book with id ${id} not found.`);
      return res
        .status(404)
        .send('Book Not Found');
    }

    res.json(book);

  })

  .delete((req,res)=>{
    const { id } = req.params;
    const bookIndex = books.findIndex(b => b.id == id);

   
    if (bookIndex===-1) {
      logger.error(`Book with id ${id} not found.`);
      return res
        .status(404)
        .send('Book Not Found');
    }

    books.splice(bookIndex,1);
    logger.info(`Book with id ${id} had been deleted`);
    res
      .status(203)
      .end();

  });




module.exports=bookRouter;