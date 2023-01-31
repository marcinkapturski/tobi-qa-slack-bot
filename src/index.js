require("dotenv").config();
const winston = require("winston");
const log = require("log-to-file");
const { Octokit } = require("@octokit/core");
var axios = require("axios");
const { App } = require("@slack/bolt");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "winstonLogs.log" }),
  ],
});

const welcomeMessage = require(__dirname + "/views/welcomeMessage");
const whatCanIDo = require(__dirname + "/views/whatCanIDo");
const selectEnvironment = require(__dirname + "/views/selectEnvironment");
const selectTestTypesDev = require(__dirname + "/views/selectTestTypesDev");
const selectTestTypesStage = require(__dirname + "/views/selectTestTypesStage");
const dispatchSuccess = require(__dirname + "/views/dispatchSuccess");
const dispatchFailed = require(__dirname + "/views/dispatchFailed");

let listOfTestsToRunDev = [];
let listOfTestsToRunStage = [];

const workflowIds = new Map([
  ["value-trading-regresssion", "trade"],
  ["value-trading-smoke", "trade"],
  ["value-trading-api", "trade"],
  ["value-wallet-api", "wallet"],
  ["value-creditcard-regresssion", "creditcard"],
  ["value-creditcard-smoke", "creditcard"],
  ["value-creditcard-api", "creditcard"],
  ["value-deposit-regresssion", "deposit"],
  ["value-deposit-smoke", "deposit"],
  ["value-loan-regresssion", "loan"],
  ["value-loan-smoke", "loan"],
  ["value-loan-api", "loan"],
  ["value-onboarding-api", "onboarding"],
  ["value-profilesettings-regresssion", "profilesettings"],
  ["value-profilesettings-smoke", "profilesettings"],
  ["value-taxbit-regresssion", "taxbit"],
  ["value-taxbit-smoke", "taxbit"],
  ["value-withdraw-regresssion", "withdraw"],
  ["value-withdraw-smoke", "withdraw"],
  ["value-withdraw-api", "withdraw"],
]);

const testTypesForModule = new Map([
  ["value-trading-regresssion", "regression"],
  ["value-trading-smoke", "smoke"],
  ["value-trading-api", "api"],
  ["value-wallet-api", "api"],
  ["value-creditcard-regresssion", "regression"],
  ["value-creditcard-smoke", "smoke"],
  ["value-creditcard-api", "api"],
  ["value-deposit-regresssion", "regression"],
  ["value-deposit-smoke", "smoke"],
  ["value-loan-regresssion", "regression"],
  ["value-loan-smoke", "smoke"],
  ["value-loan-api", "api"],
  ["value-onboarding-api", "api"],
  ["value-profilesettings-regresssion", "regression"],
  ["value-profilesettings-smoke", "smoke"],
  ["value-taxbit-regresssion", "regression"],
  ["value-taxbit-smoke", "smoke"],
  ["value-withdraw-regresssion", "regression"],
  ["value-withdraw-smoke", "smoke"],
  ["value-withdraw-api", "api"],
]);

const app = new App({
  token: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const matchText = (pattern) => {
  return async ({ event, context, next }) => {
    let tempMatches;

    if (event.text === undefined) {
      return;
    }

    if (typeof pattern === "string") {
      if (!event.text.includes(pattern)) {
        return;
      }
    } else {
      tempMatches = event.text.match(pattern);

      if (tempMatches !== null) {
        context["matches"] = tempMatches;
      } else {
        return;
      }
    }

    await next();
  };
};

const runTests = (workflows, target, branch, environment, tag) => {
  for (let workflow of workflows) {
    const workflowStatus = dispatchWorkflows(
      workflow,
      target,
      branch,
      environment,
      tag,
      workflowIds.get(workflow),
      testTypesForModule.get(workflow)
    );
    if (workflowStatus == 204) {
      logger.info("WORKFLOW IS DISPATCHED", workflowStatus);
      return workflowStatus;
    } else if (workflowStatus == 404) {
      logger.info("WORKFLOW RETURNED 404");
      return false;
    }
  }
};

const sendSuccessMessage = (workflowId, target, environment, tag) => {
  var config = {
    method: "post",
    url: `https://hooks.slack.com/services/${target}`,
    headers: {
      "Content-type": "application/json",
    },
    data: dispatchSuccess(workflowId, environment, tag),
  };

  axios(config)
    .then(function (response) {
      logger.info(JSON.stringify(response.data));
    })
    .catch(function (error) {
      logger.error(error);
    });
};

const sendFailedMessage = (workflowId, target, environment, tag) => {
  var config = {
    method: "post",
    url: `https://hooks.slack.com/services/${target}`,
    headers: {
      "Content-type": "application/json",
    },
    data: dispatchFailed(workflowId, environment, tag),
  };

  axios(config)
    .then(function (response) {
      logger.info(JSON.stringify(response.data));
    })
    .catch(function (error) {
      logger.error(error);
    });
};

const dispatchWorkflows = (
  workflow,
  target,
  branch,
  environment,
  tag,
  moduleName,
  testType
) => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  octokit
    .request(
      `POST /repos/{owner}/{repo}/actions/workflows/cy-dispatch-tests.yml/dispatches`,
      {
        owner: "marcinkapturski",
        repo: "marcinkapturski.com",
        ref: branch,
        inputs: {
          environment: environment,
          tag: tag,
          "module-name": moduleName,
          "test-type": testType,
        },
      }
    )
    .then(function (response) {
      sendSuccessMessage(workflow, target, environment, tag);
      logger.info(
        "Function(dispatchWorkflows): " +
          "workflow: " +
          workflow +
          " environment: " +
          environment +
          " tag: " +
          tag
      );
      return response.status;
    })
    .catch(function (error) {
      sendFailedMessage(workflow, target, environment, tag);
      logger.info("Function(dispatchWorkflows): ", error);
      return error;
    });
};

const logToFile = (eventName, payload, event) => {
  const userName = event.user;
  const teamId = payload.team;
  const channelId = payload.channel;
  const eventText = event.text;

  return log(
    "EVENT: " +
      eventName +
      " userName: " +
      userName +
      " teamId: " +
      teamId +
      " channelId: " +
      channelId +
      " EVENT TEXT: " +
      eventText
  );
};

app.event("app_mention", matchText(""), async ({ payload, event }) => {
  logger.info("app_mention(empty)", payload, event);
});

app.event("app_mention", async ({ say, payload, event }) => {
  log("EVENT text: " + event.text);
  // CHANGE TO: matchText(/^(hi|hey|hello|respond).*/)
  if (
    payload.text.includes("hi") ||
    payload.text.includes("hey") ||
    payload.text.includes("hello") ||
    payload.text.includes("respond")
  ) {
    try {
      say(whatCanIDo(event));
      logger.info("app_mention(regex value)", payload, event);
    } catch (error) {
      logger.info("app_mention(regex value)", error);
      console.error(error);
    }
  }
});

app.event(
  "app_mention",
  matchText("run automation tests"),
  async ({ say, payload, event }) => {
    if (event.user !== null) {
      say(selectEnvironment(event));
    }
    logger.info("app_mention(run automation tests)", payload, event);
  }
);

app.action("dev-env-action", async ({ ack, body, client }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: selectTestTypesDev(),
    });
    logger.info(
      "action(dev-env-action)" +
        " userId " +
        userId +
        +" teamId " +
        teamId +
        " channelId: " +
        channelId
    );
  } catch (error) {
    logger.error("action(dev-env-action)", error);
  }
});

app.action("stage-env-action", async ({ ack, body, client }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: selectTestTypesStage(),
    });
    logger.info(
      "action(dev-env-action)" +
        " userId " +
        userId +
        +" teamId " +
        teamId +
        " channelId: " +
        channelId
    );
  } catch (error) {
    logger.error("action(dev-env-action)", error);
  }
});

app.view(
  { callback_id: "dev-test-types" },
  async ({ ack, view, payload, event }) => {
    await ack();

    const viewData = JSON.stringify(view.state);
    const viewName = payload.blocks[0].block_id;
    listOfTestsToRunDev.length = 0;

    let stateId = viewData.replace(`${viewName}`, "block_id");
    let jsonObj = JSON.parse(stateId, (key, value) => {
      return value;
    });

    for (let tests of jsonObj.values.block_id.run_selected_values_dev
      .selected_options) {
      listOfTestsToRunDev.push(tests.value);
    }

    runTests(
      listOfTestsToRunDev,
      process.env.HOOKS_SLACK_CYPRESS_DEV,
      "develop",
      "dev",
      "runByTobi"
    );
  }
);

app.view(
  { callback_id: "stage-test-types" },
  async ({ ack, view, payload, event }) => {
    await ack();

    const viewData = JSON.stringify(view.state);
    const viewName = payload.blocks[0].block_id;
    listOfTestsToRunStage.length = 0;

    let statekId = viewData.replace(`${viewName}`, "block_id");
    let jsonObj = JSON.parse(stateId, (key, value) => {
      return value;
    });

    for (var tests of jsonObj.values.block_id.run_selected_values_dev
      .selected_options) {
      listOfTestsToRunStage.push(tests.value);
    }

    runTests(
      listOfTestsToRunStage,
      process.env.HOOKS_SLACK_CYPRESS_STAGING,
      "develop",
      "staging",
      "runByTobi"
    );
  }
);
(async () => {
  var config = {
    method: "post",
    url: `https://hooks.slack.com/services/${process.env.HOOKS_SLACK}`,
    headers: {
      "Content-type": "application/json",
    },
    data: welcomeMessage(),
  };

  axios(config)
    .then(function (response) {
      logger.info(JSON.stringify(response.data));
    })
    .catch(function (error) {
      logger.error(error);
    });

  var port = process.env.PORT || 5000;
  await app.start(port);
  logger.info("Tobie Slack Bot is running!");
})();
