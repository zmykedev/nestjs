"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvFilePath = void 0;
const environments_1 = require("../../environments");
const getEnvFilePath = () => {
    var _a;
    return ((_a = environments_1.environments[process.env.NODE_ENV]) !== null && _a !== void 0 ? _a : '.env');
};
exports.getEnvFilePath = getEnvFilePath;
//# sourceMappingURL=envFile.js.map