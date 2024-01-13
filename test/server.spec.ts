import { Axios } from 'axios';
import { beforeAll, expect, test } from 'vitest';
import { Fonzi2Client, Fonzi2Server } from '../dist';
import env from './mocks/env';
import options from './mocks/options';

let client: Fonzi2Client;
let server: Fonzi2Server;
let http: Axios;

beforeAll(async () => {
	await new Promise<void>(async (resolve) => {
		client = new Fonzi2Client(env.TOKEN, options, []);
		server = new Fonzi2Server(client, {
			inviteLink: env.INVITE_LINK,
			oauth2url: env.OAUTH2_URL,
			port: env.PORT,
			ownerIds: env.OWNER_IDS,
			version: env.VERSION,
		});
		server.start();
		http = new Axios({
			baseURL: `http://localhost:${env.PORT}`,
		});
		resolve();
	});
});

test('Server - GET /login', async () => {
	const loginPostRes = await http.get('/login');
	expect(loginPostRes.status).eq(200);
	expect(loginPostRes.headers['content-type']).eq('text/html; charset=utf-8');
});

test('Server - GET /dashboard -> Unauthorized', async () => {
	const dashboardRes = await http.get('/dashboard');
	expect(dashboardRes.status).eq(200);
	expect(dashboardRes.headers['content-type']).eq('text/html; charset=utf-8');
  expect(dashboardRes.data).contains('Unauthorized');
});
