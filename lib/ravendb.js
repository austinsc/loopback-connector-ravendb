


module.exports.initialize = function (dataSource, done) {
  var settings = dataSource.settings || {}; // The settings is passed in from the dataSource

  var connector = new RavenConnector(settings); // Construct the connector instance
  dataSource.connector = connector; // Attach connector to dataSource
  connector.dataSource = dataSource; // Hold a reference to dataSource

  /**
   * Connector instance can have an optional property named as DataAccessObject that provides
   * static and prototype methods to be mixed into the model constructor. The property can be defined
   * on the prototype.
   */
  // connector.DataAccessObject = function {};

  /**
   * Connector instance can have an optional function to be called to handle data model definitions.
   * The function can be defined on the prototype too.
   * @param model The name of the model
   * @param properties An object for property definitions keyed by propery names
   * @param settings An object for the model settings
   */
  // connector.define = function(model, properties, settings) {
  //     ...
  // };

  process.nextTick(done);
}

