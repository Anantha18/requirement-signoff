/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bomEmail from "../bomEmail.js";
import type * as briefs from "../briefs.js";
import type * as configurations from "../configurations.js";
import type * as configurator from "../configurator.js";
import type * as emailLogs from "../emailLogs.js";
import type * as emails from "../emails.js";
import type * as leads from "../leads.js";
import type * as optionalDevices from "../optionalDevices.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bomEmail: typeof bomEmail;
  briefs: typeof briefs;
  configurations: typeof configurations;
  configurator: typeof configurator;
  emailLogs: typeof emailLogs;
  emails: typeof emails;
  leads: typeof leads;
  optionalDevices: typeof optionalDevices;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
