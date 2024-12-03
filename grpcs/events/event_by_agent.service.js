if(!process.env.GRPC_EVENT_URL) throw '.env GRPC_EVENT_URL';
const path = require('path');
const grpcLibrary = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, 'event_by_agent.proto'), {
        keepCase: true,
        longs: String,
        enums: String,
        // defaults: true,
        oneofs: true
    });
const packageObjectAdmin = grpcLibrary.loadPackageDefinition(packageDefinition).event_by_agent;
const credentials =  ['production','development'].includes(process.env.NODE_ENV) ? grpcLibrary.credentials.createInsecure() : grpcLibrary.credentials.createSsl()
const EventByAgentServiceClient = new packageObjectAdmin.EventByAgentService(process.env.GRPC_EVENT_URL,credentials);
module.exports  = {
    Insert : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.Insert({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    FindOne : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.FindOne({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : null;
                resolve(data);
            })
        })
    },
    FindAll : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.FindAll({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : [];
                resolve(data);
            })
        })
    },
    FindAllWhere : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.FindAllWhere({ request : JSON.stringify(messages) }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : [];
                resolve(data);
            })
        })
    },
    Update : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.Update( messages , (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    Delete : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.Delete( messages , (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    Count : async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.Count({ request : messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.count ? response?.response?.data?.count : 0;
                resolve(data);
            })
        })
    },
    CountAllWhere: async function(messages) {
        return new Promise((resolve, reject) => {
            EventByAgentServiceClient.CountAllWhere({ request :  JSON.stringify(messages) }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.count ? response?.response?.data?.count : 0;
                resolve(data);
            })
        })
    }

}
