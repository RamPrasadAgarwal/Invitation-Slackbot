const models = require('../../models');

module.exports = {
  method: 'POST',
  path: '/slackbot-button',
  handler: (request, response) => {
    // const requestJSON = JSON.parse(request);
    // console.log('incoming request', request.payload);
    const reqJSON = JSON.parse(request.payload.payload);
    const { actions } = reqJSON;
    const status = actions[0].name;
    const eventid = actions[0].value;
    const userid = reqJSON.user.name;
    console.log('status', status);
    console.log('eventid', eventid);
    console.log('userid', userid);
    models.responses.update({
      status,
    }, {
      where: {
        [models.Sequelize.Op.and]: [{ userid }, { eventid }],
      },
    })
      .then(() => {
        models.events.findOne({
          where: {
            userid,
          },
        })
          .then(result1 => result1.dataValues)
          .then((result2) => {
            const finalMessage = `You have ${status} the ${result2.type} invitation on ${result2.venue} date: ${result2.date} time: ${result2.time}`;
            response(finalMessage);
          });
        response();
      });
  },
};

