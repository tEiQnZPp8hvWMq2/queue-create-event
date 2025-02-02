const GrpcEventByPlayerService = require('../grpcs/events/event_by_player.service');
const GrpcEventRedeemService = require('../grpcs/events/event_redeem.service');
const GrpcEventRedeemTransactionService = require('../grpcs/events/event_redeem_transaction.service');

class EventController {

    async calcualteEventTurnover(payload){
        try {
                const {event_id, event_name, player_username, agent_id, agent_prefix, type, quantity, currency, event_redeem, status} = payload;

                const insertEventByPlayer = async (payloadInsertEventPlayer) => {
                    try {
                        const findOneEventByPlayer = async (payload) => {
                            try {
                                return await GrpcEventByPlayerService.FindOne({
                                    where: {
                                        agent_id : payload.agent_id,
                                        player_username : payload.player_username,
                                        currency : payload.currency,
                                        event_id : payload.event_id
                                    }
                                })
                            } catch (error) {
                                console.log("error findOneEventByPlayer: ", error);
                                return null
                            }
                        }
                        const insertEventByPlayer = async (payload) => {
                            try {
                                return await GrpcEventByPlayerService.Insert(payload);
                            } catch (error) {
                                console.log("error insertEventByPlayer: ", error);
                                return null
                            }
                        }
                        const incrementEventByPlayer = async (payload) => {
                            try {
                                return await GrpcEventByPlayerService.Increment({
                                    request : {
                                        event_id : payload.event_id,
                                        player_username : payload.player_username,
                                        agent_id : payload.agent_id,
                                        currency : payload.currency
                                    },
                                    key : {
                                        key : "quantity",
                                        quantity : payload.quantity
                                    }
                                });
                            } catch (error) {
                                console.log("error incrementEventByPlayer: ", error);
                                return null
                            }
                        }
        
                        
                        // get Event By Player
                        const getOneEventPlayer = await findOneEventByPlayer(payloadInsertEventPlayer)
                        let result
                        if(getOneEventPlayer){
                            // increment
                            result = await incrementEventByPlayer(payloadInsertEventPlayer) 
                        } else {
                            // insert
                            result = await insertEventByPlayer(payloadInsertEventPlayer)
                        }
                        if(result == null){
                            return false
                        }
                       return true
                    } catch (error) {
                        console.log("error insertEventByPlayer: ", error);
                        return false
                    }
    
                }
                const insertTransactionRedeem = async (payload) => {
                    try {
                        const findOneEventRedeem = async () => {
                            try {
                                return await GrpcEventRedeemService.FindOne({
                                    where: {
                                        "event_id": payload.event_id,
                                        "agent_id": payload.agent_id,
                                        "type": payload.type,
                                        "currency": payload.currency,
                                        "player_username": payload.player_username
                                    }
                                })
                            } catch (error) {
                                console.log("error findOneEventRedeem: ", error);
                                return null
                            }
                        }
                        const insertEventRedeem = async () => {
                            try {
                                return GrpcEventRedeemService.Insert({
                                    event_id : payload.event_id,
                                    event_name : payload.event_name,
                                    player_username : payload.player_username,
                                    agent_id : payload.agent_id,
                                    agent_prefix : payload.agent_prefix,
                                    redeem_code : payload?.event_redeem,
                                    type : payload.type,
                                    quantity : payload.quantity,
                                    currency : payload.currency,
                                    status : 'active'
                                });
                            } catch (error) {
                                console.log("error insertEventRedeem: ", error);
                                return null
                            }
                        }
                        const incrementEventRedeem = async () => {
                            try {
                                return await GrpcEventRedeemService.Increment({
                                    request : {
                                        agent_id : payload.agent_id,
                                        player_username : payload.player_username,
                                        currency : payload.currency,
                                        event_id : payload.event_id,
                                        type : payload.type
                                    },
                                    key : {
                                        key : "quantity",
                                        quantity : payload.quantity
                                    }
                                });
                            } catch (error) {
                                console.log("error incrementEventRedeem: ", error);
                                return null
                            }
                        }
                        const insertEventRedeemTransaction = async () => {
                            try {
                                return GrpcEventRedeemTransactionService.Insert({
                                    event_id : payload.event_id,
                                    event_name : payload.event_name,
                                    player_username : payload.player_username,
                                    agent_id : payload.agent_id,
                                    agent_prefix : payload.agent_prefix,
                                    redeem_code : payload.event_redeem,
                                    type : payload.type,
                                    qauntity : payload.quantity,
                                    currency : payload.currency,
                                });
                            } catch (error) {
                                console.log("error insertEventRedeemTransaction: ", error);
                                return null
                            }
                        }
    
                        const eventRedeem = await findOneEventRedeem()
                        let result = null
                        if(eventRedeem == null){
                            //insert event redeem
                            result = await insertEventRedeem()
                        }else{
                            //increment event redeem
                            result = await incrementEventRedeem()
                        }
                        
                        if(result != null){
                            await insertEventRedeemTransaction()
                        }
                        return true
                    } catch (error) {
                        console.log("error insertTransactionRedeem: ", error);
                        return false
                    }
                }
            
                const payloadInsertEventPlayer = {
                    event_id : event_id,
                    player_username : player_username,
                    agent_id : agent_id,
                    agent_prefix : agent_prefix,
                    quantity : quantity,
                    currency : currency
                }
                const insertTicketSuccess = await insertEventByPlayer(payloadInsertEventPlayer)
                
                // insert transaction event_redeem, event_redeem_transaction
                if(insertTicketSuccess){
                    const payloadInsertEventRedeemTransaction = {
                        event_id : event_id,
                        event_name : event_name,
                        player_username : player_username,
                        agent_id : agent_id,
                        agent_prefix : agent_prefix,
                        type : type,
                        quantity : quantity,
                        currency : currency,
                        event_redeem : event_redeem,
                        status : status
                    }
                    await insertTransactionRedeem(payloadInsertEventRedeemTransaction)
                }
            return  {code : 0 , success : true, message : 'success' }
        } catch (error) {
            console.log("error calcuate: ", error);
            return {  code : 9999, success : false, message : 'failed' }
        }
    }
}

module.exports = new EventController()
