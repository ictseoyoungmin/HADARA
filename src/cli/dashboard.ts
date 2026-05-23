import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { getIntegerOption, getStringOption } from './args';

export interface DashboardCommandInput {
  args: string[];
  projectRoot: string;
}

export interface DashboardStaticResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface DashboardServeOptions {
  host?: string;
  port?: number;
}

const DASHBOARD_HTML = path.join('docs', 'design', 'dashboard', 'index.html');
const DASHBOARD_FIXTURE = path.join('docs', 'design', 'fixtures', 'hadara.ops.status.sample.json');

export function handleDashboardCommand(input: DashboardCommandInput): boolean {
  if (input.args[0] !== 'dashboard' || input.args[1] !== 'serve') return false;

  const host = getStringOption(input.args, '--host', '127.0.0.1');
  const port = getIntegerOption(input.args, '--port', { fallback: 4173, min: 1, max: 65535 });
  serveDashboard(input.projectRoot, { host, port });
  return true;
}

export function serveDashboard(projectRoot: string, options: DashboardServeOptions = {}): http.Server {
  const host = options.host ?? '127.0.0.1';
  const port = options.port ?? 4173;
  const server = http.createServer((request, response) => {
    const staticResponse = createDashboardStaticResponse(projectRoot, request.url ?? '/', request.method ?? 'GET');
    response.writeHead(staticResponse.statusCode, staticResponse.headers);
    response.end(staticResponse.body);
  });

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`[HADARA] Dashboard serving sample fixture at http://${host}:${actualPort}/dashboard/`);
  });
  return server;
}

export function createDashboardStaticResponse(projectRoot: string, requestUrl: string, method = 'GET'): DashboardStaticResponse {
  const normalizedMethod = method.toUpperCase();
  if (normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD') return methodNotAllowed();

  const pathname = safePathname(requestUrl);
  if (!pathname) return notFound();

  const headOnly = normalizedMethod === 'HEAD';
  if (pathname === '/' || pathname === '/dashboard' || pathname === '/dashboard/' || pathname === '/dashboard/index.html') {
    return fileResponse(projectRoot, DASHBOARD_HTML, 'text/html; charset=utf-8', headOnly);
  }

  if (pathname === '/fixtures/hadara.ops.status.sample.json' || pathname === '/dashboard/fixtures/hadara.ops.status.sample.json') {
    return fileResponse(projectRoot, DASHBOARD_FIXTURE, 'application/json; charset=utf-8', headOnly);
  }

  return notFound();
}

function safePathname(requestUrl: string): string | null {
  if (/(^|\/)\.\.?($|[/?#])|%2e|%2f|\\/i.test(requestUrl)) return null;
  try {
    const url = new URL(requestUrl, 'http://hadara.local');
    return url.pathname;
  } catch {
    return null;
  }
}

function fileResponse(projectRoot: string, relativePath: string, contentType: string, headOnly: boolean): DashboardStaticResponse {
  const filePath = path.join(projectRoot, relativePath);
  const body = fs.readFileSync(filePath, 'utf8');
  return {
    statusCode: 200,
    headers: securityHeaders({
      'content-type': contentType,
      'content-length': String(Buffer.byteLength(body))
    }),
    body: headOnly ? '' : body
  };
}

function notFound(): DashboardStaticResponse {
  return {
    statusCode: 404,
    headers: securityHeaders({ 'content-type': 'text/plain; charset=utf-8' }),
    body: 'Not found'
  };
}

function methodNotAllowed(): DashboardStaticResponse {
  return {
    statusCode: 405,
    headers: securityHeaders({
      'content-type': 'text/plain; charset=utf-8',
      allow: 'GET, HEAD'
    }),
    body: 'Method not allowed'
  };
}

function securityHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    'cache-control': 'no-store',
    'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'",
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff'
  };
}
