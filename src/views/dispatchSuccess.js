module.exports = function (workflowId, environment, tag) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Workflow dispatched:* by ${tag} for ${environment} ${workflowId}`,
        },
      },
    ],
  };
};
