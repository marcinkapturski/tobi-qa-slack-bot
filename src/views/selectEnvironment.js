module.exports = function (event) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${event.user}> Select environment and pick some tests to run`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "DEV environment",
              emoji: true,
            },
            style: "primary",
            action_id: "dev-env-action",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "STAGE environment",
              emoji: true,
            },
            style: "primary",
            action_id: "stage-env-action",
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "After *Submit* I will post message to one of the channels: \n #cypress-dev - for DEV environment \n #cypress-stage - for STAGE environment \n because of security reasons, I can post results only there",
        },
      },
    ],
  };
};
