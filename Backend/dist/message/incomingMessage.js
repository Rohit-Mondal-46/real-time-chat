"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpvoteMessage = exports.UserMessage = exports.InitMessage = exports.IncomingSupportedMessage = void 0;
const zod_1 = __importDefault(require("zod"));
var IncomingSupportedMessage;
(function (IncomingSupportedMessage) {
    IncomingSupportedMessage["JoinRoom"] = "JOIN_ROOM";
    IncomingSupportedMessage["SendMessage"] = "SEND_MESSAGE";
    IncomingSupportedMessage["UpvoteMessage"] = "Upvote_Message";
})(IncomingSupportedMessage || (exports.IncomingSupportedMessage = IncomingSupportedMessage = {}));
exports.InitMessage = zod_1.default.object({
    name: zod_1.default.string(),
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
});
exports.UserMessage = zod_1.default.object({
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
    message: zod_1.default.string(),
});
exports.UpvoteMessage = zod_1.default.object({
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
    chatId: zod_1.default.string(),
});
