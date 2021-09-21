const { PubSub } = require("@google-cloud/pubsub");

const pubsub = new PubSub();

exports.helloWorld = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
  const topic = pubsub.topic(`projects/intricate-grove-316621/topics/${req.body.topic}`);
  // Gets a message
  try {
      const callback = (message) => {
        message.ack();
        res.status(200).send(message.data.toString());
      };
      topic.createSubscription(req.body.sub, (err, subObj) => {
        if(err) {
          pubsub
            .subscription(req.body.sub)
            .once("message", callback);
        } else {
          subObj.once("message", callback);
        }
      })

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
    return Promise.reject(err);
  }
  }
};
