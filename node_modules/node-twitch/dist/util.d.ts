import { FParseMixedParam } from "./types/functions";
import { Stream } from "./types/objects";
export declare function getLocalAccessToken(): string;
export declare function getLocalRefreshToken(): string;
export declare function getLocalClientId(): string;
export declare function getLocalClientSecret(): string;
/**
 * Parses an object into a query string. If the value of a property is an array, that array will be parsed with the `parseArrayToQueryString` function. If a value is undefined or null, it will be skipped.
 * @param {Object} options - The options to parse.
 */
export declare function parseOptions<T>(options: T): string;
export declare function parseMixedParam({ values, stringKey, numericKey }: FParseMixedParam): string;
/**
 * Parse an array into a query string where every value has the same key.
 * @param {string} key - The key to use. This will be repeated in the query for every value in the array
 * @param {string[]|string} arr - Array of values to parse into query string.
 */
export declare function parseArrayToQueryString(key: string, arr: readonly unknown[]): string;
/** Check if a string represents a number */
export declare function isNumber(value: unknown): boolean;
export declare function addThumbnailMethod(stream: Stream): Stream;
