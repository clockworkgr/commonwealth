"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.ServerError = exports.EventHandler = void 0;
class EventHandler {
}
exports.EventHandler = EventHandler;
class ServerError extends Error {
    status;
    error;
    constructor(message, error) {
        super(message);
        this.status = 500;
        this.name = 'ServerError';
        this.error = error;
    }
}
exports.ServerError = ServerError;
class AppError extends Error {
    status;
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
