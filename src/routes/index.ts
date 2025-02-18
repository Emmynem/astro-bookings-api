import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes"; 
import bookingRoutes from "./booking.routes"; 

export default class Routes {
	constructor(app: Application) {
		app.use("/", homeRoutes, userRoutes, bookingRoutes);
	}
}