/*
 * Description
 *   A hubot script to remind you of special dates
 *
 * Configuration:
 *   LIST_OF_ENV_VARS_TO_SET
 *
 * Commands:
 *   hubot hello - <what the respond trigger does>
 *   orly - <what the hear trigger does>
 *
 * Notes:
 *   <optional notes required for the script>
 *
 * Author:
 *   Christopher 'Chief' Najewicz <chief@beefdisicple.com>
 */
var moment = require('moment');
var _ = require('lodash');
var config = require('./config.js');

module.exports = function HubotDateReminder(robot) {

  // setup date-reminders array in-memory
  robot.brain.set(config.BRAIN_KEY, []);

  function getDates() {
    return robot.brain.get(config.BRAIN_KEY)
  }

  robot.respond(config.SAVE_DATE_REGEX, function(res) {
    var the_date, the_event;

    if (res.match.length < 3) {
      return res.reply('Did you remember to use the format: "save date <mm-dd-yyyy> as <event-name>?"');
    }
    try {
      the_date = moment(res.match[1], 'MM-DD-YYYYY');
    } catch(ex) {
      return res.reply('Sorry sir, but that date format: "'+ res.match[0] +'" made me barf, try again');
    }

    the_event = res.match[2];

    getDates().push({
      date: the_date,
      title: the_event
    });

    res.reply('I have saved "' + the_event + '" on ' + the_date.format(config.DATE_DISPLAY_FORMAT) + ' for you.');

  });

  robot.respond(config.WHEN_IS_REGEX, function(res) {
    var the_event;
    if(res.match.lenth < 2) {
      return res.reply('Did you remember to use the format: "when is <event-name>?"');
    }

    the_event = res.match[1];

    found = _.find(getDates(), function(date_obj) {
      return date_obj.title == the_event;
    });

    if(!found) {
      return res.reply('Sorry, I could not find the event "' + the_event + '"');
    }

    res.reply(the_event + 'is on: ' + found.date.format(config.DATE_DISPLAY_FORMAT));

  });


  robot.respond(config.HOW_LONG_UNTIL_REGEX, function(res) {
    var the_event;
    if(res.match.lenth < 2) {
      return res.reply('Did you remember to use the format: "how long until <event-name>?"');
    }

    the_event = res.match[1];

    found = _.find(getDates(), function(date_obj) {
      return date_obj.title == the_event;
    });

    if(!found) {
      return res.reply('Sorry, I could not find the event "' + the_event + '"');
    }

    res.reply(the_event + 'is ' + found.date.toNow());

  });


  robot.respond(config.LIST_DATES_REGEX, function(res) {
    var date_str = '';
    getDates().forEach(function(date_obj) {
      date_str += 'Date: ' + date_obj.date.format(config.DATE_DISPLAY_FORMAT) + ' Event: ' + date_obj.title + "\n";
    });

    res.reply('All the dates I know of:' + "\n" + date_str);

  });

}
