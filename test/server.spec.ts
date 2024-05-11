import { Axios } from 'axios';
import { Client } from 'discord.js';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { Fonzi2Client, Fonzi2Server } from '../dist';
import { ConfigLoader } from '../dist/config/config.loader';
import env from './mocks/env';
import options from './mocks/options';
import HomeController from './mocks/controllers/home.controller.ts';

describe('Fonzi2Server', () => {
  let client: Fonzi2Client;
  let server: Fonzi2Server;
  let http: Axios;
  beforeAll(async () => {
    const config = ConfigLoader.loadConfig();
    expect(config).to.be.an('object');

    await new Promise<void>(async (resolve) => {
      client = new Fonzi2Client(env.TOKEN, options, []);
      server = new Fonzi2Server(client as Client<true>, [new HomeController()]);
      expect(server.config).to.deep.equal(config.server);
      server.start();
      http = new Axios({
        baseURL: `http://localhost:${env.PORT}`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      resolve();
    });
  });

  test('Server - GET / (Discord auth)', async () => {
    const loginRes = await http.get('/');
    expect(loginRes.status).eq(200);
    expect(loginRes.data).contains('Discord');
    expect(loginRes.headers['content-type']).eq('text/html');
  });

  test('Server - GET /login', async () => {
    const loginRes = await http.get('/login');
    expect(loginRes.status).eq(200);
    expect(loginRes.headers['content-type']).eq('text/html; charset=utf-8');
  });

  test('Server - GET /notfound (redirect)', async () => {
    const loginRes = await http.get('/jibberish');
    expect(loginRes.status).eq(200);
    expect(loginRes.headers['content-type']).eq('text/html; charset=utf-8');
    expect(loginRes.data).contains('404');
  });

  test('Server - GET /dashboard -> Unauthorized', async () => {
    const dashboardRes = await http.get('/dashboard');
    expect(dashboardRes.status).eq(200);
    expect(dashboardRes.headers['content-type']).eq('text/html; charset=utf-8');
    expect(dashboardRes.data).contains('Unauthorized');
  });

  test('Controller - GET /home -> Successful Response', async () => {
    const res = await http.get('/home');
    expect(res.status).eq(200);
    expect(res.data).contains('test');
    expect(res.headers['content-type']).eq('text/html; charset=utf-8');
  });

  test('Controller - POST /home -> Successful Response', async () => {
    const res = await http.post('/home', JSON.stringify({ test: 'test' }));
    expect(res.status).eq(200);
    expect(res.data).contains('test-post');
    expect(res.headers['content-type']).eq('text/html; charset=utf-8');
  });

  afterAll(async () => {
    await server.stop();
  });
});
