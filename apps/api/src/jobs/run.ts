import {db} from '../db.js';
import {scanAlerts,deliverOutbox} from './worker.js';
try{console.log({alertsCreated:await scanAlerts(),emailsSent:await deliverOutbox()});}finally{await db.$disconnect();}
