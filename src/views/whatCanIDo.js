module.exports = function (event) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey <@${event.user}> , What can I do for you? :disguised_face: \nIf you whant me to run automation tests just type \n *@Tobi run automation tests* \n I will guide you throw all tests what we have for DEV or STAGE environment`,
        },
      },
    ],
  };
};
