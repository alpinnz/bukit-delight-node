declare module "socket.io-client" {
  export interface Socket {
    on(eventName: string, listener: (...args: unknown[]) => void): this;
    off(eventName: string, listener: (...args: unknown[]) => void): this;
    disconnect(): this;
  }

  export function io(uri: string): Socket;
}
