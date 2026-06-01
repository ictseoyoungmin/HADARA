import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { safeCreateActiveRunProjection } from '../services/active-run-state';
import { createDashboardBootstrapReport } from '../services/dashboard-bootstrap';
import {
  createDashboardCacheKey,
  createDashboardCacheStatusReport,
  DASHBOARD_CACHE_TTLS,
  getOrCreateCachedReport,
  withDashboardCacheMetadata
} from '../services/dashboard-cache';
import { createDashboardTaskDetailReport } from '../services/dashboard-task-detail';
import { createEvidenceLintReport } from '../services/evidence-lint';
import { createEvidenceListReport } from '../services/evidence-list';
import { createDashboardTimelineReport } from '../services/dashboard-timeline';
import { createOperationalDebtReport } from '../services/operational-debt';
import { createOpsStatusReport } from '../services/operations-status-service';
import { createTaskListReport } from '../services/task-read-model';
import { createTaskWorkbenchReport } from '../services/task-workbench';
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
    let staticResponse: DashboardStaticResponse;
    try {
      staticResponse = createDashboardServerResponse(projectRoot, request.url ?? '/', request.method ?? 'GET');
    } catch {
      staticResponse = internalError();
    }
    response.writeHead(staticResponse.statusCode, staticResponse.headers);
    response.end(staticResponse.body);
  });

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    // console.log(`[HADARA] Dashboard serving sample fixture at http://${host}:${actualPort}/dashboard/`);
    console.log(`[HADARA] Dashboard serving at http://${host}:${actualPort}/dashboard/ with read-only APIs under /api/.`);
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

export function createDashboardServerResponse(projectRoot: string, requestUrl: string, method = 'GET'): DashboardStaticResponse {
  try {
    const apiResponse = createDashboardApiResponse(projectRoot, requestUrl, method);
    if (apiResponse) return apiResponse;
    return createDashboardStaticResponse(projectRoot, requestUrl, method);
  } catch {
    return internalError();
  }
}

function createDashboardApiResponse(projectRoot: string, requestUrl: string, method: string): DashboardStaticResponse | null {
  const normalizedMethod = method.toUpperCase();
  if (normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD') return null;

  const url = safeUrl(requestUrl);
  if (!url || !url.pathname.startsWith('/api/')) return null;

  const headOnly = normalizedMethod === 'HEAD';
  if (url.pathname === '/api/status') return jsonResponse(createOpsStatusReport(projectRoot), headOnly);
  if (url.pathname === '/api/dashboard/bootstrap') {
    const selectedTaskId = url.searchParams.get('selectedTaskId')?.trim();
    const key = selectedTaskId
      ? createDashboardCacheKey(projectRoot, 'bootstrap', 'selected', selectedTaskId)
      : createDashboardCacheKey(projectRoot, 'bootstrap');
    const cached = getOrCreateCachedReport(
      key,
      { ttlMs: DASHBOARD_CACHE_TTLS.bootstrap, bypass: url.searchParams.get('cache') === 'bypass' },
      () => createDashboardBootstrapReport(projectRoot, selectedTaskId ? { selectedTaskId } : {})
    );
    return jsonResponse(withDashboardCacheMetadata(cached.value, cached.cache), headOnly);
  }
  if (url.pathname === '/api/dashboard/task-detail') {
    const taskId = url.searchParams.get('taskId')?.trim();
    if (!taskId) return missingTaskId(headOnly);
    const key = createDashboardCacheKey(projectRoot, 'task-detail', taskId);
    const cached = getOrCreateCachedReport(
      key,
      { ttlMs: DASHBOARD_CACHE_TTLS.taskDetail, bypass: url.searchParams.get('cache') === 'bypass' },
      () => createDashboardTaskDetailReport(projectRoot, taskId)
    );
    return jsonResponse(withDashboardCacheMetadata(cached.value, cached.cache), headOnly);
  }
  if (url.pathname === '/api/dashboard/cache/status') return jsonResponse(createDashboardCacheStatusReport(), headOnly);
  if (url.pathname === '/api/tasks') return jsonResponse(createTaskListReport(projectRoot), headOnly);
  if (url.pathname === '/api/active-run') return jsonResponse(safeCreateActiveRunProjection(projectRoot), headOnly);
  if (url.pathname === '/api/debt') return jsonResponse(createOperationalDebtReport(projectRoot), headOnly);
  if (url.pathname === '/api/timeline') {
    const taskId = url.searchParams.get('taskId')?.trim();
    const key = taskId ? createDashboardCacheKey(projectRoot, 'timeline', taskId) : createDashboardCacheKey(projectRoot, 'timeline');
    const cached = getOrCreateCachedReport(
      key,
      { ttlMs: DASHBOARD_CACHE_TTLS.timeline, bypass: url.searchParams.get('cache') === 'bypass' },
      () => createDashboardTimelineReport(projectRoot, taskId ? { taskId } : {})
    );
    return jsonResponse(withDashboardCacheMetadata(cached.value, cached.cache), headOnly);
  }
  if (url.pathname === '/api/task-workbench') {
    const taskId = url.searchParams.get('taskId')?.trim();
    if (!taskId) return missingTaskId(headOnly);
    return jsonResponse(createTaskWorkbenchReport(projectRoot, taskId), headOnly);
  }
  if (url.pathname === '/api/evidence-lint') {
    const taskId = url.searchParams.get('taskId')?.trim();
    if (!taskId) return missingTaskId(headOnly);
    return jsonResponse(createEvidenceLintReport(projectRoot, taskId), headOnly);
  }
  if (url.pathname === '/api/evidence') {
    const taskId = url.searchParams.get('taskId')?.trim();
    if (!taskId) return missingTaskId(headOnly);
    return jsonResponse(createEvidenceListReport(projectRoot, { taskId }), headOnly);
  }

  return notFound();
}

function missingTaskId(headOnly: boolean): DashboardStaticResponse {
  return jsonResponse(
    {
      schemaVersion: 'hadara.dashboard.api.error.v1',
      command: 'dashboard.api',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_ID_REQUIRED',
          message: 'Missing required query parameter: taskId.'
        }
      ]
    },
    headOnly,
    400
  );
}

function safePathname(requestUrl: string): string | null {
  const url = safeUrl(requestUrl);
  return url?.pathname ?? null;
}

function safeUrl(requestUrl: string): URL | null {
  if (/(^|\/)\.\.?($|[/?#])|%2e|%2f|\\/i.test(requestUrl)) return null;
  try {
    return new URL(requestUrl, 'http://hadara.local');
  } catch {
    return null;
  }
}

function fileResponse(projectRoot: string, relativePath: string, contentType: string, headOnly: boolean): DashboardStaticResponse {
  const filePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(filePath)) return notFound();
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

function jsonResponse(bodyValue: unknown, headOnly: boolean, statusCode = 200): DashboardStaticResponse {
  const body = `${JSON.stringify(bodyValue, null, 2)}\n`;
  return {
    statusCode,
    headers: securityHeaders({
      'content-type': 'application/json; charset=utf-8',
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

function internalError(): DashboardStaticResponse {
  return {
    statusCode: 500,
    headers: securityHeaders({ 'content-type': 'text/plain; charset=utf-8' }),
    body: 'Internal server error'
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
