/* jshint esnext: true */
/* global Dependencies */
"use strict";

export default Dependencies;

export const classNames = Dependencies.classNames;
export const ReactOnClickOutside = Dependencies.ReactOnClickOutside;
export const _ = Dependencies.Lodash;
export const Inflection = Dependencies.Inflection;

// Make lodash and inflection globally available for use in non-jsx files
_.extend(_, Inflection);
window._ = _;
