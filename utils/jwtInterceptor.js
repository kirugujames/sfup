import jwt from 'jsonwebtoken';
import User  from '../auth/models/User.js';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).send({
      message: 'Token is required',
      data: null,
      statusCode: 403,
    });
  }

  jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        try {
          const decodedExpired = jwt.decode(token);
          if (decodedExpired?.id) {
            await User.update(
              { is_logged_in: false, session_token: null },
              { where: { id: decodedExpired.id } }
            );
          }
        } catch (dbErr) {
          console.error('Error updating user status on token expiry:', dbErr.message);
        }

        return res.status(401).send({
          message: 'Session expired. Please log in again.',
          data: null,
          statusCode: 401,
        });
      }

      return res.status(401).send({
        message: err.message,
        data: null,
        statusCode: 401,
      });
    }

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ['session_token'],
    });

    if (!user || !user.session_token) {
      return res.status(401).send({
        message: 'Invalid session. Please log in again.',
        data: null,
        statusCode: 401,
      });
    }

    req.user = decoded;
    next();
  });
}
