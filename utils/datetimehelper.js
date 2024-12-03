// const moment = require('moment');
const GrpcAgentSettingService = require('../grpcs/agent-settings/agents.service');
const TimeZone = require('./timezone')
const moment = require('moment-timezone');
class DatetimeHelper {
    async getLocationAgentSetting(agent_id){
        try {
            const agentLocation = await GrpcAgentSettingService.FindOne({
                "where": {
                    "agent_id": agent_id,
                    "type": "default_login",
                    "key": "default"
                }
            })
            if(agentLocation){
                return await TimeZone.find(tz => tz.code == agentLocation.value)
            }else{
                const agentLocation = await GrpcAgentSettingService.FindOne({
                    "where": {
                        "agent_id": agent_id,
                        "type": "default_login",
                        "key": "default_login"
                    }
                })
                if(!agentLocation){
                    return null 
                }
                return await TimeZone.find(tz => tz.currency == agentLocation.currency)
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async getLocationAgentSetting(agent_id){
        try {
            const agentLocation = await GrpcAgentSettingService.FindOne({
                "where": {
                    "agent_id": agent_id,
                    "type": "default_login",
                    "key": "default"
                }
            })
            if(agentLocation){
                return await TimeZone.find(tz => tz.code == agentLocation.value)
            }else{
                const agentLocation = await GrpcAgentSettingService.FindOne({
                    "where": {
                        "agent_id": agent_id,
                        "type": "default_login",
                        "key": "default_login"
                    }
                })
                if(!agentLocation){
                    return null 
                }
                return await TimeZone.find(tz => tz.currency == agentLocation.currency)
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async getZone(agent_id){
        let zone = await this.getLocationAgentSetting(agent_id)
        if(!zone){
            return null
        }
        return zone.format || null
    }

    async dateNow(agent_id, date, format = 'DD-MM-YYYY HH:mm:ss'){
        let zone = await this.getZone(agent_id)
        return moment(date).tz(zone).format(format);
    }

    async dateNowZoneMoment(agent_id, date, timeZone){
        let dateTime = date.clone(); 
        let zone = timeZone; 
        if(!timeZone){
            zone = await this.getZone(agent_id)
        }
        return dateTime.tz(zone);
    }

    async createStartDateZoneMoment(agent_id, date, timeZone){ //2024-08-15
        const dateTime = date.clone()
        let zone = timeZone; 
        if(!timeZone){
            zone = await this.getZone(agent_id)
        }
        
        return moment.tz(dateTime, zone).startOf('day');
    }

    async dateNowTimeSpan(agent_id, timeZone, date){
        let dateNow = moment()
        if(date){
            dateNow = date.clone()
        }
        let zone = timeZone; 
        if(!timeZone){
            zone = await this.getZone(agent_id)
        }
        return moment(dateNow).tz(zone).valueOf();
    }

    //date moment()
    //format 00:00:00
    async addTimeToTimeSpan(agent_id, date, addTime, timeZone){
        let addDateTime = date.clone(); 
        let zone = timeZone
        if(!timeZone){
            zone = await this.getZone(agent_id)
        }
        
        addDateTime = moment(addDateTime).tz(zone).startOf('day')

        const [hour, minute, second] = addTime.split(':').map(Number);
        addDateTime.set({ hour, minute, second });

        return addDateTime.valueOf();
    }

    async dateTimeToIso(agent_id, date, timeZone){
        let dateTime = date.clone(); 
        let zone = timeZone
        if(!timeZone){
            zone = await this.getZone(agent_id)
        }
        return moment(dateTime).tz(zone).toISOString()

    }

    async addDateTimeMoment(dateMoment, add, type){
        const dateTime = dateMoment.clone(); 
        return dateTime.add(add, type)

    }

    async subtractDateTimeMoment(dateMoment, subtract, type){
        const dateTime = dateMoment.clone(); 
        return dateTime.subtract(subtract, type)

    }

    async addDateTimeIso(dateMoment, add, type){
        const dateTime = dateMoment.clone(); 
        return dateTime.startOf('day').add(add, type).toISOString()

    }

    async convertTimeSpan(agent_id, timeZone, date){
        //type date is moment time
        let dateNow = moment()
        if(date){
            dateNow = date.clone()
        }
        let zone = timeZone; 
        if(!timeZone){
            zone = await this.getZone(agent_id)
        }
        return moment(dateNow).tz(zone).valueOf();
    }

    async startDateToIso(date){
        //type date is moment time
        const dateTime = date.clone(); 
        return dateTime.startOf('day').toISOString()

    }

    async endDateToIso(date){
        //type date is moment time
        const dateTime = date.clone(); 
        return dateTime.endOf('day').toISOString()
    }

    async convertDateToThaiZoneMoment(date){
        const dateTime = date.clone(); 
        return dateTime.tz('Asia/Bangkok');
    }

    async convertStartDateToThaiZoneMoment(date){
        const dateTime = date.clone(); 
        return dateTime.tz('Asia/Bangkok').startOf('day');
    }

    async convertEndDateToThaiZoneMoment(date){
        const dateTime = date.clone(); 
        return dateTime.tz('Asia/Bangkok').endOf('day');
    }

    async dateStartUTCMoment(date){
        const dateTime = date.clone(); 
        return dateTime.tz('UTC');
    }

    async getTimeZone(agent_id){
        return await this.getZone(agent_id)
    }

    async getTimeZoneByCurrency(currency){
        const zone =  await TimeZone.find(tz => tz.currency == currency)
        return zone?.format || null
    }

    async calculateTimeDifference(offset1, offset2){
        function parseOffset(offset) {
            const sign = offset[0];
            const hours = parseInt(offset.slice(1, 3));
            const minutes = parseInt(offset.slice(4, 6));
            const totalMinutes = (hours * 60) + minutes;
            return sign === '+' ? totalMinutes : -totalMinutes;
        }
    
        const minutesOffset1 = parseOffset(offset1);
        const minutesOffset2 = parseOffset(offset2);
    
        // คำนวณความแตกต่างในหน่วยชั่วโมง
        const differenceInMinutes = Math.abs(minutesOffset1 - minutesOffset2);
        const differenceInHours = differenceInMinutes / 60;
    
        return differenceInHours;
    }
}
module.exports = new DatetimeHelper();