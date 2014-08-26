var ravendb = require('ravendb');
var _ = require('underscore');
var async = require('async');
var Connector = require('loopback-connector').Connector;
var name = 'ravendb';
var db;

module.exports.name = name;
module.exports.initialize = function (dataSource, done) {
  var settings = dataSource.settings || {}; // The settings is passed in from the dataSource
  db = ravendb(settings.server, settings.db);
  var connector = new RavenDB(settings); // Construct the connector instance
  dataSource.connector = connector; // Attach connector to dataSource
  connector.dataSource = dataSource; // Hold a reference to dataSource
  process.nextTick(done);
}

var RavenDB = function(settings) {
};

  /**
   * Connector instance can have an optional property named as DataAccessObject that provides
   * static and prototype methods to be mixed into the model constructor. The property can be defined
   * on the prototype.
   */
// RavenDB.prototype.DataAccessObject = function() {
//   return ravendb.Document;
// };

  /**
   * Connector instance can have an optional function to be called to handle data model definitions.
   * The function can be defined on the prototype too.
   * @param model The name of the model
   * @param properties An object for property definitions keyed by propery names
   * @param settings An object for the model settings
   */
// RavenDB.prototype.define = function(model, properties, settings) {
// };

/**
 * Create a new model instance
 */
RavenDB.prototype.create = function (model, data, done) {
  db.saveDocument(model, data, done);
};

/**
 * Save a model instance
 */
RavenDB.prototype.save = function (model, data, done) {
  db.saveDocument(model, data, done);
};

/**
 * Check if a model instance exists by id
 */
RavenDB.prototype.exists = function (model, id, done) {
  db.getDocument(id, done);
};

/**
 * Find a model instance by id
 */
RavenDB.prototype.find = function find(model, id, done) {
  db.getDocument(id, done);
};

/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
RavenDB.prototype.updateOrCreate = function updateOrCreate(model, data, done) {
  db.getDocument(id, function(err, doc){
    doc = doc || {};
    _.extend(doc, data);
    db.saveDocument(model, doc, done);
  });
};

/**
 * Delete a model instance by id
 */
RavenDB.prototype.destroy = function destroy(model, id, done) {
  db.deleteDocument(id, done);
};

/**
 * Query model instances by the filter
 */
RavenDB.prototype.all = function all(model, filter, done) {
  console.log('WARNING: filter is not yet implemented');
  db.getDocumentCount(model, function(err, count) {
    if(err) return done(err, null);
    var starter = 0,
      block = 256,
      result = [],
      starts = [];

    while(count - starter < block) {
      starts.push(starter);
      starter += block;
    }

    async.each(starts, function(start, next) {
      db.getDocsInCollection(model, start, 256, function(err, docs){
        for(var i = 0; i < docs.length; i++) {
          result.push(docs[i]);
        }
        next(err)
      });
    }, function(err){
      done(err, result);
    });
  });
};

/**
 * Delete all model instances
 */
RavenDB.prototype.destroyAll = function destroyAll(model, filter, done) {
  this.all(model, filter, function(err, docs){
  async.each(docs, function(doc, next) {
    db.deleteDocument(model, doc.id, next);
  }, function(err){
      done(err);
    });
  });
};

/**
 * Count the model instances by the where criteria
 */
RavenDB.prototype.count = function count(model, done, where) {
  console.log('WARNING: where is not yet implemented');
  db.getDocumentCount(model, done);
};

/**
 * Update the attributes for a model instance by id
 */
RavenDB.prototype.updateAttributes = function updateAttrs(model, id, data, done) {
    db.getDocument(id, function(err, doc){
    doc = doc || {};
    _.extend(doc, data);
    db.saveDocument(model, doc, done);
  });
};
