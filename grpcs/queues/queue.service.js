if(!process.env.GRPC_QUEUE_URL) throw '.env GRPC_QUEUE_URL';
const path = require('path');
const grpcLibrary = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, 'queue.proto'), {
        keepCase: true,
        longs: String,
        enums: String,
        // defaults: true,
        oneofs: true
    });
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition).queue;
const credentials =  ['production','development'].includes(process.env.NODE_ENV) ? grpcLibrary.credentials.createInsecure() : grpcLibrary.credentials.createSsl()
const client = new packageObject.QueueService(process.env.GRPC_QUEUE_URL,credentials);
module.exports = {
    MailerQueue : async function(messages){
        return new Promise((resolve, reject) => {
            client.MailerQueue({ data : JSON.stringify(messages) }, (err, response) => {
                if (err) return resolve(null);
                const data = response.data ? JSON.parse(response.data) : null;
                resolve(data);
            })
        })
    },
    BackGroundQueue : async function(messages){
        return new Promise((resolve, reject) => {
            client.BackGroundQueue({ data : JSON.stringify(messages) }, (err, response) => {
                if (err) return resolve(null);
                const data = response.data ? JSON.parse(response.data) : null;
                resolve(data);
            })
        })
    },
    EventQueue : async function(messages){
        return new Promise((resolve, reject) => {
            client.EventQueue({ data : JSON.stringify(messages) }, (err, response) => {
                if (err) return resolve(null);
                const data = response.data ? JSON.parse(response.data) : null;
                resolve(data);
            })
        })
    },
}
