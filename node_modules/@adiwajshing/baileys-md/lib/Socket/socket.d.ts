/// <reference types="node" />
import WebSocket from "ws";
import { SocketConfig, BaileysEventEmitter, ConnectionState } from "../Types";
import { BinaryNode } from '../WABinary';
/**
 * Connects to WA servers and performs:
 * - simple queries (no retry mechanism, wait for connection establishment)
 * - listen to messages and emit events
 * - query phone connection
 */
export declare const makeSocket: ({ waWebSocketUrl, connectTimeoutMs, logger, agent, keepAliveIntervalMs, version, browser, auth: initialAuthState, printQRInTerminal, defaultQueryTimeoutMs }: SocketConfig) => {
    ws: WebSocket;
    ev: BaileysEventEmitter;
    authState: import("../Types").AuthenticationState;
    readonly user: import("../Types").Contact;
    assertingPreKeys: (range: number, execute: (keys: {
        [_: number]: any;
    }) => Promise<void>) => Promise<void>;
    generateMessageTag: () => string;
    query: (node: BinaryNode, timeoutMs?: number) => Promise<BinaryNode>;
    waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Buffer | Uint8Array) => Promise<void>;
    sendNode: (node: BinaryNode) => Promise<void>;
    logout: () => Promise<void>;
    end: (error: Error | undefined) => void;
    waitForConnectionUpdate: (check: (u: Partial<ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
};
export declare type Socket = ReturnType<typeof makeSocket>;
