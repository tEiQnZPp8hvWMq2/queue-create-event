if(!process.env.GRPC_AFF_PLAYER_URL) throw '.env GRPC_AFF_PLAYER_URL';
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
const packageObjectAdmin = grpcLibrary.loadPackageDefinition(packageDefinition).aff_daily_winloss;
const credentials = process.env.NODE_ENV == 'production' ||  process.env.NODE_ENV == 'development' ? grpcLibrary.credentials.createInsecure()  : grpcLibrary.credentials.createSsl();
const ServiceClient = new packageObjectAdmin.AffDailyWinlossService(process.env.GRPC_AFF_PLAYER_URL,credentials,{
    'grpc.max_receive_message_length' : -1,
    'grpc.max_send_message_length' : -1,
    'grpc-node.max_session_memory' : -1,
});
module.exports  = {
    Insert : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.Insert({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    FindOne : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.FindOne({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : null;
                resolve(data);
            })
        })
    },
    FindAll : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.FindAll({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : [];
                resolve(data);
            })
        })
    },
    FindAllWhere : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.FindAllWhere({ request : JSON.stringify(messages) }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data ? response.response.data : [];
                resolve(data);
            })
        })
    },
    Update : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.Update( messages , (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    Increment : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.Increment( messages , (err, response) => {
                if (err) return reject(err);
                // const data = response?.response?.data?.affected ||  null;
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    Delete : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.Delete( messages , (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.raw?.length || 0 >= 1 ? response.response.data.raw[0] : null;
                resolve(data);
            })
        })
    },
    Count : async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.Count({ request: messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.count ? response?.response?.data?.count : 0;
                resolve(data);
            })
        })
    },
    CountAllWhere: async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.CountAllWhere({ request :  JSON.stringify(messages) }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response?.data?.count ? response?.response?.data?.count : 0;
                resolve(data);
            })
        })
    },
    Query: async function(messages) {
        return new Promise((resolve, reject) => {
            ServiceClient.Query({ request : messages }, (err, response) => {
                if (err) return reject(err);
                const data = response?.response ? JSON.parse(response?.response) : null;
                resolve(data);
            })
        })
    }   

}
