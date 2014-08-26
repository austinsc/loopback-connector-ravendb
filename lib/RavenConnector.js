var ravendb = require('ravendb');
var _ = require('underscore');
var async = require('async');
var Connector = require('loopback-connector');

var RavenConnector = function(settings) {
  RavenConnector.super_.call(this, "ravendb", settings);

  if(!settings || !settings.server) {
    throw Error('RavenConnector ctor: expected valid settings');
  }
  this.db = ravendb(settings.server, settings.db);
};
util.inherits(RavenConnector, Connector);

RavenConnector.prototype.DataAccessObject = function() {
  return ravendb.Document;
};

// RavenConnector.prototype.define = function(model, properties, settings) {
// };

/**
 * Create a new model instance
 */
RavenConnector.prototype.create = function (model, data, done) {
  this.db.saveDocument(model, data, done);
};

/**
 * Save a model instance
 */
RavenConnector.prototype.save = function (model, data, done) {
  this.db.saveDocument(model, data, done);
};

/**
 * Check if a model instance exists by id
 */
RavenConnector.prototype.exists = function (model, id, done) {
  this.db.getDocument(id, done);
};

/**
 * Find a model instance by id
 */
RavenConnector.prototype.find = function find(model, id, done) {
  this.db.getDocument(id, done);
};

/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
RavenConnector.prototype.updateOrCreate = function updateOrCreate(model, data, done) {
  this.db.getDocument(id, function(err, doc){
    doc = doc || {};
    _.extend(doc, data);
    this.db.saveDocument(model, doc, done);
  });
};

/**
 * Delete a model instance by id
 */
RavenConnector.prototype.destroy = function destroy(model, id, done) {
  this.db.deleteDocument(id, done);
};

/**
 * Query model instances by the filter
 */
RavenConnector.prototype.all = function all(model, filter, done) {
  console.log('WARNING: filter is not yet implemented');
  this.db.getDocumentCount(model, function(err, count) {
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
RavenConnector.prototype.destroyAll = function destroyAll(model, filter, done) {
  this.all(model, filter, function(err, docs){
  async.each(docs, function(doc, next) {
    this.db.deleteDocument(model, doc.id, next);
  }, function(err){
      done(err);
    });
  });
};

/**
 * Count the model instances by the where criteria
 */
RavenConnector.prototype.count = function count(model, done, where) {
  console.log('WARNING: where is not yet implemented');
  this.db.getDocumentCount(model, done);
};

/**
 * Update the attributes for a model instance by id
 */
RavenConnector.prototype.updateAttributes = function updateAttrs(model, id, data, done) {
    this.db.getDocument(id, function(err, doc){
    doc = doc || {};
    _.extend(doc, data);
    this.db.saveDocument(model, doc, done);
  });
};

module.exports = RavenConnector;