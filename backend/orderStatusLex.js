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


function dispatch(intentRequest, callback) {
    console.log(`request received for intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    console.log(intentRequest.currentIntent);
    const slots = intentRequest.currentIntent.slots;
    const orderId = slots.orderId;
        try {
            console.log('Then run MySQL code:');
            var select = dbConn.query("select * from restaurant.orders where orderId=?", [orderId]);
            if(select[0] != undefined)
            {
                callback(close(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': `Your order is in,  ${select[0].orderStatus} state`}))   
            } 
            else {
                callback(close(sessionAttributes,'Fulfilled', {'contentType': 'PlainText', 'content': `You have entered wrong order id. Please check and retry`}));
            } 
        }
        catch (error) {
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