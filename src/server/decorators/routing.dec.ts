import 'reflect-metadata';
import type { RequestHandler } from 'express';
import type { ServerController } from '../base.controller';

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
  TRACE = 'trace',
  CONNECT = 'connect',
}

export interface RouteDefinitionMetadata {
  path: string;
  requestMethod: RequestMethod;
  method: Function;
  middlewares?: RequestHandler[];
}

export const routeDefinitionsKey = Symbol('route-definitions');

function createRouteDecorator(method: RequestMethod) {
  return (path: string, ...middlewares: RequestHandler[]): MethodDecorator =>
    (target: ServerController, _, descriptor: PropertyDescriptor): void => {
      if (!Reflect.hasMetadata(routeDefinitionsKey, target)) {
        Reflect.defineMetadata(routeDefinitionsKey, [], target);
      }
      const routes: RouteDefinitionMetadata[] =
        Reflect.getMetadata(routeDefinitionsKey, target) || [];
      routes.push({
        requestMethod: method,
        path,
        method: descriptor.value,
        middlewares,
      });
      Reflect.defineMetadata(routeDefinitionsKey, routes, target);
    };
}

export function getRoutesMetadata(target: any): RouteDefinitionMetadata[] {
  return Reflect.getOwnMetadata(routeDefinitionsKey, Reflect.getPrototypeOf(target)!) || [];
}

export const Get = createRouteDecorator(RequestMethod.GET);
export const Post = createRouteDecorator(RequestMethod.POST);
export const Put = createRouteDecorator(RequestMethod.PUT);
export const Delete = createRouteDecorator(RequestMethod.DELETE);
export const Patch = createRouteDecorator(RequestMethod.PATCH);
export const Options = createRouteDecorator(RequestMethod.OPTIONS);
export const Head = createRouteDecorator(RequestMethod.HEAD);
export const Connect = createRouteDecorator(RequestMethod.CONNECT);
export const Trace = createRouteDecorator(RequestMethod.TRACE);
