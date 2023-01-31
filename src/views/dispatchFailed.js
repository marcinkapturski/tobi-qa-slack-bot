module.exports = function (workflowId, environment, tag) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*FAILED* workflow dispatch for ${environment} \n ${workflowId}`,
        },
      },
    ],
  };
};
