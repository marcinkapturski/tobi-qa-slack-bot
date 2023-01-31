module.exports = function () {
  return {
    callback_id: "stage-test-types",
    type: "modal",
    title: {
      type: "plain_text",
      text: "STAGE environment",
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Select type of tests to run",
        },
        accessory: {
          type: "multi_static_select",
          placeholder: {
            type: "plain_text",
            text: "Select options",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "Trading UI Regression",
                emoji: true,
              },
              value: "value-trading-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "Trading UI Smoke",
                emoji: true,
              },
              value: "value-trading-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "Trading API",
                emoji: true,
              },
              value: "value-trading-api",
            },
            {
              text: {
                type: "plain_text",
                text: "Wallet API",
                emoji: true,
              },
              value: "value-wallet-api",
            },
            {
              text: {
                type: "plain_text",
                text: "CreditCard UI Regression",
                emoji: true,
              },
              value: "value-creditcard-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "CreditCard UI Smoke",
                emoji: true,
              },
              value: "value-creditcard-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "CreditCard API",
                emoji: true,
              },
              value: "value-creditcard-api",
            },
            {
              text: {
                type: "plain_text",
                text: "Deposit UI Regression",
                emoji: true,
              },
              value: "value-deposit-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "Deposit UI Smoke",
                emoji: true,
              },
              value: "value-deposit-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "Loan UI Regression",
                emoji: true,
              },
              value: "value-loan-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "Loan UI Smoke",
                emoji: true,
              },
              value: "value-loan-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "Loan API",
                emoji: true,
              },
              value: "value-loan-api",
            },
            {
              text: {
                type: "plain_text",
                text: "OnBoarding API",
                emoji: true,
              },
              value: "value-onboarding-api",
            },
            {
              text: {
                type: "plain_text",
                text: "ProfileSettings UI Regression",
                emoji: true,
              },
              value: "value-profilesettings-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "ProfileSettings UI Smoke",
                emoji: true,
              },
              value: "value-profilesettings-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "TaxBit UI Regression",
                emoji: true,
              },
              value: "value-taxbit-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "TaxBit UI Smoke",
                emoji: true,
              },
              value: "value-taxbit-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "Withdraw UI Regression",
                emoji: true,
              },
              value: "value-withdraw-regresssion",
            },
            {
              text: {
                type: "plain_text",
                text: "Withdraw UI Smoke",
                emoji: true,
              },
              value: "value-withdraw-smoke",
            },
            {
              text: {
                type: "plain_text",
                text: "Withdraw API",
                emoji: true,
              },
              value: "value-withdraw-api",
            },
          ],
          action_id: "run_selected_values_dev",
        },
      },
    ],
  };
};
