import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes"; 
import bookingRoutes from "./booking.routes"; 
import appDefaultRoutes from "./appDefault.routes"; 

export default class Routes {
	constructor(app: Application) {
		app.use("/", homeRoutes, userRoutes, bookingRoutes, appDefaultRoutes);
	}
}