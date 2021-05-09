"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraper = void 0;
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var dom_ids_1 = require("./dom-ids");
var logger_1 = require("../logger");
var Scraper = /** @class */ (function () {
    function Scraper() {
    }
    Scraper.fetch = function (stockSymbol, companyName) {
        return __awaiter(this, void 0, void 0, function () {
            var html, stockData, html, lookupData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.info('Scraper running!');
                        if (!stockSymbol) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.requestQuoteHTML(stockSymbol)];
                    case 1:
                        html = _a.sent();
                        stockData = this.parseQuoteHTML(html);
                        logger_1.logger.info(stockData);
                        return [2 /*return*/, stockData];
                    case 2:
                        if (!companyName) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.requestLookupHTML(companyName)];
                    case 3:
                        html = _a.sent();
                        lookupData = this.parseLookupHTML(html);
                        logger_1.logger.info(lookupData);
                        return [2 /*return*/, lookupData];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.parseQuoteHTML = function (html) {
        var _a, _b;
        var DOM = cheerio_1.default.load(html);
        var headerInfo = DOM(dom_ids_1.DomIds.HEADER_INFO_ID);
        var leftTable = DOM(dom_ids_1.DomIds.LEFT_SUMMARY_TABLE);
        var rightTable = DOM(dom_ids_1.DomIds.RIGHT_SUMMARY_TABLE);
        var marketNoticeNode = DOM(dom_ids_1.DomIds.MARKET_NOTICE_ID);
        var fairValueNode = DOM(dom_ids_1.DomIds.FAIR_VALUE_ID);
        var chartEventNode = DOM(dom_ids_1.DomIds.CHART_EVENT_ID);
        var getText = function (dom, context) {
            return DOM(dom).find(context).first().text();
        };
        // const getExchangeText = (dom: unknown, context: unknown) => DOM(dom).find(context).first()
        var name = getText(headerInfo, "h1");
        var exchange = getText(headerInfo, "span").split('-')[0].trim();
        // if it exists, return first idx, otherwise N/A
        var symbol = (_b = (_a = name.match(/\((.+)\)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 'N/A';
        var currentPrice = marketNoticeNode.prev().prev().text();
        var dayChangeText = marketNoticeNode.prev().text();
        var dayChangeMatch = dayChangeText.match(/(.+)\s\((.+%)\)/);
        var _c = dayChangeMatch !== null && dayChangeMatch !== void 0 ? dayChangeMatch : [
            '',
            'N/A',
            'N/A',
        ], _ = _c[0], dayChangeDollar = _c[1], dayChangePercent = _c[2];
        // Left Table
        var previousClosePrice = getText(leftTable, dom_ids_1.DomIds.PREV_CLOSE_VALUE);
        var openPrice = getText(leftTable, dom_ids_1.DomIds.OPEN_VALUE);
        var bidPrice = getText(leftTable, dom_ids_1.DomIds.BID_VALUE);
        var askPrice = getText(leftTable, dom_ids_1.DomIds.ASK_VALUE);
        var dayRange = getText(leftTable, dom_ids_1.DomIds.DAYS_RANGE_VALUE);
        var yearRange = getText(leftTable, dom_ids_1.DomIds.FIFTY_TWO_WK_RANGE);
        var volume = getText(leftTable, dom_ids_1.DomIds.TD_VOLUME_VALUE);
        var avgVolume = getText(leftTable, dom_ids_1.DomIds.AVERAGE_VOLUME_3MONTH_VALUE);
        // Right Table
        var marketCap = getText(rightTable, dom_ids_1.DomIds.MARKET_CAP_VALUE);
        var fiveYearMonthly = getText(rightTable, dom_ids_1.DomIds.BETA_5Y_VALUE);
        var peRatio = getText(rightTable, dom_ids_1.DomIds.PE_RATIO);
        var eps = getText(rightTable, dom_ids_1.DomIds.EPS_RATIO_VALUE);
        var earningsDate = getText(rightTable, dom_ids_1.DomIds.EARNINGS_DATE_VALUE);
        var forwardDividendAndYield = getText(rightTable, dom_ids_1.DomIds.DIVIDEND_AND_YIELD_VALUE);
        var exDividendDate = getText(rightTable, dom_ids_1.DomIds.EX_DIVEND_DATE_VALUE);
        var oneYearTarget = getText(rightTable, dom_ids_1.DomIds.ONE_YEAR_TARGET_PRICE_VALUE);
        if (oneYearTarget === undefined || oneYearTarget === '') {
            oneYearTarget = 'N/A';
        }
        // Other Values
        var fairValue = getText(fairValueNode, "div:contains('XX'):lt(1)").split('XX')[2];
        if (fairValue === undefined || fairValue === '') {
            fairValue = 'N/A';
        }
        var patternDetectedNode = chartEventNode.find("span:contains('pattern detected')");
        var chartEventValue = patternDetectedNode.prev().text();
        if (chartEventValue === undefined || chartEventValue === '') {
            chartEventValue = 'N/A';
        }
        var stockData = {
            name: name,
            exchange: exchange,
            symbol: symbol,
            currentPrice: currentPrice,
            dayChangeDollar: dayChangeDollar,
            dayChangePercent: dayChangePercent,
            previousClosePrice: previousClosePrice,
            openPrice: openPrice,
            bidPrice: bidPrice,
            askPrice: askPrice,
            dayRange: dayRange,
            yearRange: yearRange,
            volume: volume,
            avgVolume: avgVolume,
            marketCap: marketCap,
            fiveYearMonthly: fiveYearMonthly,
            peRatio: peRatio,
            eps: eps,
            earningsDate: earningsDate,
            forwardDividendAndYield: forwardDividendAndYield,
            exDividendDate: exDividendDate,
            oneYearTarget: oneYearTarget,
            fairValue: fairValue,
            chartEventValue: chartEventValue,
        };
        return stockData;
    };
    Scraper.parseLookupHTML = function (html) {
        var DOM = cheerio_1.default.load(html);
        var getText = function (dom, context) {
            return DOM(dom).find(context).first().text();
        };
        var getElement = function (dom, context) {
            return DOM(dom).find(context);
        };
        var lookupPage = DOM(dom_ids_1.DomIds.LOOKUP_PAGE);
        var bestMatch = getElement(lookupPage, "tbody tr").first();
        var symbol = getText(bestMatch, "td a");
        var name = getText(bestMatch, "td");
        var lastPrice = getText(bestMatch, "td")[2];
        var lookupData = {
            symbol: symbol,
            name: name,
            lastPrice: lastPrice
        };
        return lookupData;
    };
    Scraper.requestQuoteHTML = function (stockSymbol) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.logger.info("Scraping HTML (quote data) for stock symbol '" + stockSymbol + "'...");
                        return [4 /*yield*/, this.client.get("" + this.QUOTE_URL + stockSymbol)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_1 = _a.sent();
                        logger_1.logger.error(e_1);
                        throw new Error('Error making GET request!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.requestLookupHTML = function (companyName) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.logger.info("Scraping HTML (lookup data) for company name '" + companyName + "'...");
                        return [4 /*yield*/, this.client.get("" + this.LOOKUP_URL + companyName)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_2 = _a.sent();
                        logger_1.logger.error(e_2);
                        throw new Error('Error making GET request!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.QUOTE_URL = 'https://finance.yahoo.com/quote/';
    Scraper.LOOKUP_URL = 'https://finance.yahoo.com/lookup?s=';
    Scraper.client = axios_1.default.create();
    return Scraper;
}());
exports.Scraper = Scraper;
