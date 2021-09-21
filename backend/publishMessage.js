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
    let message = req.query.message || req.body.message || "Hello World!";
    const topic = pubsub.topic(`projects/intricate-grove-316621/topics/interact1`);

    const messageObject = {
      data: {
        message: message,
      },
    };
    const messageBuffer = Buffer.from(JSON.stringify(messageObject), "utf8");

    // Publishes a message
    try {
      await topic.publish(messageBuffer).then(msRes => console.log(msRes));
      res.status(200).send("Message published.");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
      return Promise.reject(err);
    }
  }
};
