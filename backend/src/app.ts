import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit'; // kept for types only
import dotenv from 'dotenv';

dotenv.config();

import authRoutes         from './routes/auth.routes';
import donationsRoutes    from './routes/donations.routes';
import projectsRoutes     from './routes/projects.routes';
import applicationsRoutes from './routes/applications.routes';
import dashboardRoutes    from './routes/dashboard.routes';
import usersRoutes        from './routes/users.routes';
import beneficiariesRoutes from './routes/beneficiaries.routes';
import employeesRoutes    from './routes/employees.routes';
import volunteersRoutes   from './routes/volunteers.routes';
import tasksRoutes        from './routes/tasks.routes';
import financeRoutes      from './routes/financial.routes';
import publicRoutes       from './routes/public.routes';
import cmsRoutes          from './routes/cms.routes';
import contactRoutes      from './routes/contact.routes';
import rolesRoutes        from './routes/roles.routes';
import permissionsRoutes  from './routes/permissions.routes';
import { globalLimiter }  from './middleware/rate-limit.middleware';

const app = express();



// ==========================================
// Middlewares
// ==========================================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression() as any);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL    || 'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(globalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// Routes
// ==========================================
const PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(`${PREFIX}/auth`,         authRoutes);
app.use(`${PREFIX}/donations`,    donationsRoutes);
app.use(`${PREFIX}/projects`,     projectsRoutes);
app.use(`${PREFIX}/applications`, applicationsRoutes);
app.use(`${PREFIX}/dashboard`,    dashboardRoutes);
app.use(`${PREFIX}/users`,        usersRoutes);
app.use(`${PREFIX}/beneficiaries`, beneficiariesRoutes);
app.use(`${PREFIX}/employees`,    employeesRoutes);
app.use(`${PREFIX}/volunteers`,   volunteersRoutes);
app.use(`${PREFIX}/tasks`,        tasksRoutes);
app.use(`${PREFIX}/finance`,      financeRoutes);
app.use(`${PREFIX}/public`,       publicRoutes);
app.use(`${PREFIX}/cms`,          cmsRoutes);
app.use(`${PREFIX}/contact`,      contactRoutes);
app.use(`${PREFIX}/roles`,        rolesRoutes);
app.use(`${PREFIX}/permissions`,  permissionsRoutes);

// ==========================================
// Health Check
// ==========================================
app.get('/health', (_req, res) => {
  res.json({
    status:  '✅ يعمل',
    project: 'Yatama Charity Foundation API',
    version: '1.0.0',
    time:    new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.json({ message: '🌙 مرحباً بك في API مؤسسة اليتامى الخيرية' });
});

// ==========================================
// 404 Handler
// ==========================================
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'المسار غير موجود' });
});

// ==========================================
// Error Handler
// ==========================================
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطأ داخلي في الخادم',
  });
});

export default app;
