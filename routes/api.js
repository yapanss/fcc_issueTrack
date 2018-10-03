/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
var collection

MongoClient.connect(CONNECTION_STRING, (err, db) => {

      var db = db.db('fcc_mongodb')
       collection = db.collection('issues')
})

  app.route('/api/issues/:project')
      .get(function (req, res){
      var project = req.params.project;
      var query = {}
      for (var key in req.query) {
        query[key] = req.query[key]
      }

      collection.find(query).toArray((err, issues) => {
        res.send(issues) 
      })
     
    })
    .post(function (req, res){
      var project = req.params.project;
      var body = req.body
      var date = new Date()

      body['created_on'] = date.toISOString()
      body['updated_on'] = date.toISOString()
      body['open'] = true
      
      collection.insertOne(body, (err, issue) => {
        
        res.send(body)
      })
    })

    app.route('/api/issues/:project')
    .put(function (req, res){

      var project = req.params.project;
      var id = new ObjectId(req.body._id);
      var body = {}

      for(var key in req.body) {
        if(key !== "_id" && req.body[key].length > 0) {
          body[key] = req.body[key]
        }
      }

      var date = new Date();
      body['updated_on'] = date.toISOString();
       var newvalues = { $set: body }

      collection.updateOne({_id: id} , newvalues, (err, issue) => {
        
        if(err) {
          res.send(`could not update ${id}`)
        }

        if(Object.keys(body).length == 1) {
          res.send('no updated field sent')
        } else {
          res.send('successfully updated')
        }
        
    })
    })
    .delete(function (req, res){
      var project = req.params.project;
      var message
      if(!req.body._id) {
        res.send('_id error')
      } else {
        var id = new ObjectId(req.body._id);
        collection.deleteOne({_id: id} , (err, issue) => {
            if(err) {message = `could not delete ${id}`}
              else {
                message = `deleted ${id}`
              }
            res.send(message)
          });
        
      }
    })
      
      
    
// })
}



  