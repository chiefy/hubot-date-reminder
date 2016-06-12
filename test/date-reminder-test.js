Helper = require('hubot-test-helper');
chai = require('chai');
moment = require('moment');
config = require('../src/config.js');

expect = chai.expect

helper = new Helper('../src/date-reminder.js')

describe('date-reminder', function() {
  var room;

  before(function() {
    room = helper.createRoom();
  });

  after(function() {
    room.destroy();
  });

  describe('saves event dates to brain', function () {

    it('responds when queried to save a date', function (done) {

      var date_str = '06-16-2016';
      var event_name = 'Jack\'s Birthday';
      var response_date_str = moment(date_str,'MM-DD-YYYY').format(config.DATE_DISPLAY_FORMAT);
      var alice_says = ['alice', '@hubot save date ' + date_str + ' as ' + event_name ];

      room.user.say.apply(room.user, alice_says)
        .then(function() {
          var response = '@alice I have saved "' + event_name + '" on ' + response_date_str + ' for you.';
          expect(room.messages).to.eql([ alice_says, ['hubot', response]]);
          done();
        });
    });

  });

  describe('informs how long until a specified event', function () {
    var date_str = '06-16-2016';
    var event_name = 'Jack\'s Birthday';
    var jack_says = ['jack', '@hubot how long until ' + event_name];
    it('responds to "how long until"', function (done) {
      room.user.say.apply(room.user, jack_says)
        .then(function() {
          expect(room.messages).to.exist;
          done();
        });
    });

  });

  describe('lists any previously saved events', function () {

    it('responds to query for date list', function (done) {
      var jack_says = ['jack', '@hubot list dates'];
      room.user.say.apply(room.user, jack_says)
        .then(function() {
          done();
        })
    });

  });

});
