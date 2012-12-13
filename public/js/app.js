var TBClient = function() {

  var apiKey = '20374802';
  var session = null;
  var publisher = null;
  var myStream = 'myStream';

  var init = function init(sessionId, email) {
    session = TB.initSession(sessionId);
    session.addEventListener('sessionConnected', sessionConnectedHandler);
    session.addEventListener('streamCreated', streamCreatedHandler);
    listenEvents(email);
  };

  var streamCreatedHandler = function streamCreatedHandler(event) {
    // Subscribe to any new streams that are created
    subscribeToStreams(event.streams);
  };

  connect: function connect(token) {
    session.connect(apiKey, token);
  };

  var sessionConnectedHandler = function sessionConnectedHandler(event) {
    var publishProps = {height:240, width:320};
    publisher = TB.initPublisher(apiKey, myStream, publishProps);
    // Send my stream to the session
    session.publish(publisher);

    // Subscribe to streams that were in the session when we connected
    subscribeToStreams(event.streams);
  };

  var subscribeToStreams = function subscribeToStreams(streams) {
    for (var i = 0; i < streams.length; i++) {
      // Make sure we don't subscribe to ourself
      if (streams[i].connection.connectionId == session.connection.connectionId) {
        return;
      }

      // Create the div to put the subscriber element in to
      var div = document.createElement('div');
      div.setAttribute('id', 'stream' + streams[i].streamId);
      document.body.appendChild(div);

      // Subscribe to the stream
      session.subscribe(streams[i], div.id);
    }
  };

  var listenEvents = function listen(channel) {
    // PUBNUB.subscribe( options )
    PUBNUB.subscribe({
      channel  : channel,
      callback : messageHandler,
      error    : function(e) {
        // Do not call subscribe() here!
        // PUBNUB will auto-reconnect.
        console.log(e);
      }
    });
  };

  var messageHandler = function messageHandler(msg) {
    alert(msg);
    console.log("**** NEW MSG " + msg);
  };

  return {
    init: init,
    connect: connect
  }
}();
