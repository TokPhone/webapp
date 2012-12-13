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
    startTimer();
    startListeners();
  };

  var startListeners = function startListeners() {
    var accept = document.getElementById('accept');
    var decline = document.getElementById('decline');
    var popup = document.getElementById('popup');
    accept.addEventListener('click', function() {
      popup.classList.add('hidden');
    });

    decline.addEventListener('click', function() {
      popup.classList.add('hidden');
    });
  };

  var startTimer = function startTimer() {
    var m = 0;
    var s =0;
    // add a zero in front of numbers<10
    function startTime() {
      s = (s+1) % 60;
      if (s == 0)
        m = (m+1) % 60;
      var ms=checkTime(m);
      var ss=checkTime(s);
      document.getElementById('time').innerHTML=ms+":"+ss;
      t=setTimeout(function(){startTime()},1000);
    }

    function checkTime(i) {
      if (i<10) {
        i="0" + i;
      }
      return i;
    }
    startTime();
  }

  var streamCreatedHandler = function streamCreatedHandler(event) {
    // Subscribe to any new streams that are created
    subscribeToStreams(event.streams);
  };

  connect: function connect(token) {
    session.connect(apiKey, token);
  };

  var sessionConnectedHandler = function sessionConnectedHandler(event) {
    var publishProps = {height: 200, width: 300};
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
      var streamWidth = window.innerWidth;
      var streamHeight = window.innerHeight - 120;
      var container = document.getElementById('container');
      if (streams.length == 2) {
        streamWidth = (window.innerWidth / 2.5) - 20;
        streamHeight = (streamHeight / 2);
        container.classList.add('two');
      }
      div.setAttribute('id', 'stream' + streams[i].streamId);
      if (i == 1)
        div.classList.add('last');
      if (i == 0)
        div.classList.add('first');
      div.classList.add('stream');
      container.appendChild(div);

      // Subscribe to the stream
      session.subscribe(streams[i], div.id, {width: streamWidth, height: streamHeight});
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
    var popup = document.getElementById('popup');
    popup.classList.remove('hidden');
  };

  return {
    init: init,
    connect: connect
  }
}();
