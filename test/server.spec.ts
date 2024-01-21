import { Axios } from 'axios';
import { Client } from 'discord.js';
import { beforeAll, expect, test } from 'vitest';
import { Fonzi2Client, Fonzi2Server } from '../dist';
import { ConfigLoader } from '../dist/config/config.loader';
import env from './mocks/env';
import options from './mocks/options';

let client: Fonzi2Client;
let server: Fonzi2Server;
let http: Axios;

beforeAll(async () => {
  const config = ConfigLoader.loadConfig();
	expect(config).to.be.an('object');

	await new Promise<void>(async (resolve) => {
    client = new Fonzi2Client(env.TOKEN, options, []);
		server = new Fonzi2Server(client as Client<true>);
    expect(server.config).to.deep.equal(config.server);
		server.start();
		http = new Axios({
			baseURL: `http://localhost:${env.PORT}`,
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
