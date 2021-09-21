var mysql = require('sync-mysql');

var dbConn = new mysql({
    host     : '35.222.234.108',
    user     : 'root',
    password : '5410db-password',
});
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function elicitSlot(sessionAttributes, currentIntent, eSlot) {
       let slots = currentIntent.slots;
        return {
            sessionAttributes,
            dialogAction: {
                type: "ElicitSlot",
                intentName: currentIntent.name,
                slotToElicit: eSlot,
                slots
        },
    };
}
function check(orderId){
    console.log(orderId);
    console.log("Entered");
    var select = dbConn.query("select * from restaurant.orders where orderId=?", [orderId]);
    if(select[0] != undefined){
        return true; 
    }
    else{
        return false;
    }
}

function dispatch(intentRequest, callback) {
    console.log(`request received for intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    const key = slots.key;
    const reviewResponse = slots.review;
    const orderId = slots.orderId;
    const negative_words = ["bad", "horrible", "shit", "yuck", "disgust", "poisoned", "disappointed" ];
    const positive_words = ["good", "tasty", "yummy", "delicious", "scrumptious" ];
    
        try {
            switch(key)
            {
                case "order":
                    callback(close(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `You can place the orders from this url - https://react-fe-i4o2eck5za-uc.a.run.app/allRestaurants`}));
                case "feedback":
                    if(reviewResponse==null)
                    {
                        if(orderId==null)
                        {
                            callback(elicitSlot(sessionAttributes,intentRequest.currentIntent, "orderId"));
                        }else
                        {
                            var checkStatus = check(orderId);
                            checkStatus ? callback(elicitSlot(sessionAttributes,intentRequest.currentIntent, "review")) : callback(close(sessionAttributes,'Fulfilled', {'contentType': 'PlainText', 'content': `You have entered wrong order id. Please check and retry`}));
                        }
                    }
                    else if(reviewResponse.split(' ').some(r=> negative_words.indexOf(r) >= 0))
                    {
                        console.log(reviewResponse);
                        const update = dbConn.query("update restaurant.orders set review=? where orderId=?", [reviewResponse, orderId]);
                        console.log(update);
                        callback(close(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `Oops, we are sorry to hear that. Your feedback is recorded! Have a nice day`}));
                    }
                    else if(reviewResponse.split(' ').some(r=> positive_words.indexOf(r) >= 0))
                    {
                        const update = dbConn.query("update restaurant.orders set review=? where orderId=?", [reviewResponse, orderId]);
                        callback(close(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `We are glad to hear that. Your feedback is recorded! Have a nice day`}));
                    }
                    else
                    {
                        const update = dbConn.query("update restaurant.orders set review=? where orderId=?", [reviewResponse, orderId]);
                        callback(close(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `Thank you for your valuable feedback. Your feedback is recorded! Have a nice day`}));
                    }
            }
            } catch (error) {
        }
}
 
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};
