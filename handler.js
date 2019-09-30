'use strict';

module.exports.checkQueue = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Checking env variables...',
        input: event,
        queueURL: process.env.TASK_QUEUE_URL,
        queueARN: process.env.TASK_QUEUE_ARN,
      },
      null,
      2
    ),
  };
};

module.exports.consume = async event => {
  for (const record of event.Records) {
    console.log("Processing record ", JSON.stringify(record))
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      event,
      null,
      2
    )
  }
}

const AWS = require('aws-sdk');

module.exports.newMessage = async event => {
  const sqs = new AWS.SQS()
  const payload = {
    DelaySeconds: 10,
    MessageAttributes: {
      "SomeAttribute": {
        DataType: "String",
        StringValue: "Some Value"
      }
    },
    MessageBody: JSON.stringify(event.body),
    QueueUrl: process.env.TASK_QUEUE_URL
  }

  await sqs.sendMessage(payload).promise()
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      { message: "queued" },
      null,
      2
    )
  }
}