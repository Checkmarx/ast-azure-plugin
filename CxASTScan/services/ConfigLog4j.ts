import {LFService, LoggerFactoryOptions, LogGroupRule, LogLevel} from "typescript-logging";

const options = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp("model.+"), LogLevel.Debug))
    .addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Info));


export const factory = LFService.createNamedLoggerFactory("LoggerFactory", options);