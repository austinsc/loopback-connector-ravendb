var RavenConnector = require('./RavenConnector');

module.exports.initialize = function (dataSource, done) {
  var settings = dataSource.settings || {}; // The settings is passed in from the dataSource

  var connector = new RavenConnector(settings); // Construct the connector instance
  dataSource.connector = connector; // Attach connector to dataSource
  connector.dataSource = dataSource; // Hold a reference to dataSource

  process.nextTick(done);
}

