const GrpcQueueServices = require('./queue.service');

module.exports = {
    mailer : async function(item){
        if (!item?.topic || !item?.payload) return false
        return GrpcQueueServices.MailerQueue({
            topic : item.topic,
            payload : item.payload,
            option : {
                removeOnComplete: process.env.NODE_ENV == 'production' ? 100000 :  100,
                timeout : 60000
            }
        });
    },
    background : async function(item){
        if (!item?.topic || !item?.payload) return false
        return GrpcQueueServices.BackGroundQueue({
            topic : item.topic,
            payload : item.payload,
            option : {
                removeOnComplete: process.env.NODE_ENV == 'production' ? 100000 :  100,
                timeout : 60000
            }
        });
    },
    event : async function(item){
        if (!item?.topic || !item?.payload) return false
        return GrpcQueueServices.EventQueue({
            topic : item.topic,
            payload : item.payload,
            option : {
                removeOnComplete: process.env.NODE_ENV == 'production' ? 100000 :  100,
                timeout : 60000
            }
        });
    }
}