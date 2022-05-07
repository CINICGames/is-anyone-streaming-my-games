"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addThumbnailMethod = exports.isNumber = exports.parseArrayToQueryString = exports.parseMixedParam = exports.parseOptions = exports.getLocalClientSecret = exports.getLocalClientId = exports.getLocalRefreshToken = exports.getLocalAccessToken = void 0;
const fs_1 = __importDefault(require("fs"));
const userFile = "./data/apiUser.json";
function getLocalAccessToken() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.access_token;
}
exports.getLocalAccessToken = getLocalAccessToken;
function getLocalRefreshToken() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.refresh_token;
}
exports.getLocalRefreshToken = getLocalRefreshToken;
function getLocalClientId() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.client_id;
}
exports.getLocalClientId = getLocalClientId;
function getLocalClientSecret() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.client_secret;
}
exports.getLocalClientSecret = getLocalClientSecret;
/**
 * Parses an object into a query string. If the value of a property is an array, that array will be parsed with the `parseArrayToQueryString` function. If a value is undefined or null, it will be skipped.
 * @param {Object} options - The options to parse.
 */
function parseOptions(options) {
    let query = "";
    for (const key in options) {
        const value = options[key];
        if (value === null || value === undefined)
            continue;
        if (Array.isArray(value))
            query += parseArrayToQueryString(key, value);
        else
            query += `${key}=${value}&`;
    }
    return query.replace(/&$/, "");
}
exports.parseOptions = parseOptions;
function parseMixedParam({ values, stringKey, numericKey }) {
    let query = "";
    function addToQuery(value) {
        const key = !isNumber(value) ? stringKey : numericKey;
        query += `${key}=${value}&`;
    }
    if (Array.isArray(values))
        values.forEach(addToQuery);
    else
        addToQuery(values);
    return query.replace(/&$/, "");
}
exports.parseMixedParam = parseMixedParam;
/**
 * Parse an array into a query string where every value has the same key.
 * @param {string} key - The key to use. This will be repeated in the query for every value in the array
 * @param {string[]|string} arr - Array of values to parse into query string.
 */
function parseArrayToQueryString(key, arr) {
    const list = Array.isArray(arr) ? arr : [arr];
    const result = list.map(value => `${key}=${value}`).join("&");
    return result;
}
exports.parseArrayToQueryString = parseArrayToQueryString;
/** Check if a string represents a number */
function isNumber(value) {
    if (typeof value === "undefined")
        return false;
    if (value === null)
        return false;
    if (("" + value).includes("x"))
        return false;
    return !isNaN(Number("" + value));
}
exports.isNumber = isNumber;
function addThumbnailMethod(stream) {
    const thumbnailUrl = stream.thumbnail_url;
    stream.getThumbnailUrl = (options = { width: 1920, height: 1080 }) => {
        const { width, height } = options;
        return thumbnailUrl.replace("{width}", "" + width).replace("{height}", "" + height);
    };
    return stream;
}
exports.addThumbnailMethod = addThumbnailMethod;
