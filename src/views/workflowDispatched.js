const workflowDispatched = JSON.stringify({
  blocks: [
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Automation tests dispatch for \nProject: *Loan Smoke Tests*  :ghost: \n Environment: *DEV* \n With tag: *Tobi*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "When run will be completed status will be posted here \n*Slack Channel*: <https://testingletsautomate.slack.com/archives/C04L2RZD4DR|#cypress-localhost-automation>",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "and on *DEV QE Dashboard* <https://marcinkapturski.atlassian.net/jira/dashboards/10174|DEV QE Dashboard>",
      },
    },
  ],
});

exports.workflowDispatched = workflowDispatched;
