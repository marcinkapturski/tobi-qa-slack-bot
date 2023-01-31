module.exports = function (event) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hello <@${event.user}> If you whant me to run automation tests just type \n *@Tobi run automation tests* \n I will guide you throw all tests what we have for DEV or STAGE environment`,
        },
      },
    ],
  };
};
