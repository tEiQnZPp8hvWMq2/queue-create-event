if(!process.env.GRPC_AGENT_URL) throw '.env GRPC_AGENT_URL';
const path = require('path');
const grpcLibrary = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, 'index.proto'), {
        keepCase: true,
        longs: String,
        enums: String,
        // defaults: true,
        oneofs: true
    });
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition).agents;
const credentials =  ['production','development'].includes(process.env.NODE_ENV) ? grpcLibrary.credentials.createInsecure() : grpcLibrary.credentials.createSsl()
const client = new packageObject.AgentsService(process.env.GRPC_AGENT_URL,credentials);
module.exports  = {
    FindOne : async function(messages) {
        return new Promise((resolve, reject) => {
            client.FindOne({ request :messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : null;
                resolve(data);
            })
        })
    },
    FindAll : async function(messages) {
        return new Promise((resolve, reject) => {
            client.FindAll({ request :messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : [];
                resolve(data);
            })
        })
    },
    Insert : async function(messages) {
        return new Promise((resolve, reject) => {
            client.Insert({ request : messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0]  : null;
                resolve(data);
            })
        })
    },
    Update : async function(messages) {
        return new Promise((resolve, reject) => {
            client.Update(messages, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0]  : null;
                resolve(data);
            })
        })
    },
    Count : async function(messages) {
        return new Promise((resolve, reject) => {
            client.Count({ request : messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.count ? response?.response?.data?.count : 0;
                resolve(data);
            })
        })
    },
    Increment : async function(messages) {
        return new Promise((resolve, reject) => {
            client.Increment(messages, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    Delete : async function(messages) {
        return new Promise((resolve, reject) => {
            client.Delete({ request : messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0]  : null;
                resolve(data);
            })
        })
    },
    FindAllWhere : async function(messages) {
        return new Promise((resolve, reject) => {
            client.FindAllWhere({ request :  JSON.stringify(messages) }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : [];
                resolve(data);
            })
        })
    },
    CountAllWhere: async function(messages) {
        return new Promise((resolve, reject) => {
            client.CountAllWhere({ request :  JSON.stringify(messages) }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.count ? response?.response?.data?.count : 0;
                resolve(data);
            })
        })
    },
}