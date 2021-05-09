"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var tslog_1 = require("tslog");
/* log levels available: silly | trace | debug | info | warn | error | fatal */
var formatAsJson = false;
exports.logger = formatAsJson
    ? new tslog_1.Logger({ type: 'json' })
    : new tslog_1.Logger();
