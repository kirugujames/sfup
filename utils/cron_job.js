import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User  from '../auth/models/User.js';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export function startSessionCleaner() {
  cron.schedule('* * * * *', async () => {
    console.log('Checking for expired sessions...');
    try {
      const users = await User.findAll({
        where: {
          is_logged_in: true,
          session_token: { [User.sequelize.Op.ne]: null },
        },
        attributes: ['id', 'username', 'session_token'],
      });

      for (const user of users) {
        try {
          jwt.verify(user.session_token, JWT_SECRET_KEY);
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            await User.update(
              { is_logged_in: false, session_token: null },
              { where: { id: user.id } }
            );
          }
        }
      }
    } catch (err) {
    
    }
  });
}
