import { logAction } from "../audit-trails/audit-trail-controller.js";

export const auditMiddleware = (actionName) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            // Only log successful operations or specific intentional logs
            if (res.statusCode >= 200 && res.statusCode < 400) {
                try {
                    const user_id = req.user ? req.user.id : (req.body && req.body.userId ? req.body.userId : null);

                    // Filter sensitive data from body
                    const sanitizedBody = { ...req.body };
                    const sensitiveFields = ['password', 'token', 'access_token', 'refreshToken', 'otp'];
                    sensitiveFields.forEach(field => {
                        if (sanitizedBody[field]) sanitizedBody[field] = '********';
                    });

                    const action = actionName || `${req.method} ${req.originalUrl}`;

                    // Simple logic to extract entity from action name or URL
                    let entity = "Unknown";
                    if (actionName) {
                        const parts = actionName.split('_');
                        if (parts.length > 0) {
                            entity = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
                        }
                    } else {
                        const pathParts = req.originalUrl.split('/');
                        if (pathParts.length > 2) {
                            entity = pathParts[2].charAt(0).toUpperCase() + pathParts[2].slice(1).toLowerCase();
                        }
                    }

                    const description = `${action.replace(/_/g, ' ')} performed on ${entity}`;

                    const details = JSON.stringify({
                        method: req.method,
                        url: req.originalUrl,
                        body: sanitizedBody,
                        params: req.params,
                        query: req.query,
                        statusCode: res.statusCode
                    });

                    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                    logAction(user_id, action, description, entity, details, ip_address);
                } catch (err) {
                    console.error("Audit log interceptor error:", err.message);
                }
            }
            return originalSend.apply(res, arguments);
        };
        next();
    };
};
