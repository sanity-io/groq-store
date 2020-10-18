// _Partial_ type definitions for simple-get

/// <reference types="node" />
declare module 'simple-get' {
  import {Request} from 'https'

  interface Options {
    url: string
    headers?: Record<string, string>
  }

  function simpleGet(
    options: Options,
    callback: (err: Error | undefined, res: Request) => void
  ): void

  export = simpleGet
}
