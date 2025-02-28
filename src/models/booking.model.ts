import { Model, Table, Column, DataType } from "sequelize-typescript";
import { db_end, db_start } from "../config/config";
import User from "./user.model";

export interface IBooking {
	id?: number;
	unique_id?: string;
	user_unique_id?: string;
	fullname: string;
	email: string;
	phone_number?: string;
	amount: number;
	priority_amount?: number;
	total_amount: number;
	details?: string;
	proof_image?: string;
	proof_image_public_id?: string;
	topup_proof_image?: string;
	topup_proof_image_public_id?: string;
	booking_status?: string;
	status?: number;
}

@Table({
	tableName: `${db_start}bookings${db_end}`
})
export default class Booking extends Model {
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: "id"
	})
	id?: number;

	@Column({
		type: DataType.STRING(40),
		allowNull: false,
		unique: true,
		field: "unique_id"
	})
	unique_id?: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
		field: "user_unique_id",
		references: {
			model: User,
			key: "unique_id"
		}
	})
	user_unique_id?: string;

	@Column({
		type: DataType.STRING(500),
		allowNull: false,
		field: "fullname"
	})
	fullname?: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
		field: "email"
	})
	email?: string;

	@Column({
		type: DataType.STRING(20),
		allowNull: true,
		field: "phone_number"
	})
	phone_number?: string;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
		field: "amount"
	})
	amount?: number;

	@Column({
		type: DataType.FLOAT,
		allowNull: true,
		field: "priority_amount"
	})
	priority_amount?: number;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
		field: "total_amount"
	})
	total_amount?: number;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
		field: "details"
	})
	details?: string;

	@Column({
		type: DataType.STRING(500),
		allowNull: true,
		field: "proof_image"
	})
	proof_image?: string;

	@Column({
		type: DataType.STRING(500),
		allowNull: true,
		field: "proof_image_public_id"
	})
	proof_image_public_id?: string;

	@Column({
		type: DataType.STRING(500),
		allowNull: true,
		field: "topup_proof_image"
	})
	topup_proof_image?: string;

	@Column({
		type: DataType.STRING(500),
		allowNull: true,
		field: "topup_proof_image_public_id"
	})
	topup_proof_image_public_id?: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
		field: "booking_status"
	})
	booking_status?: string;

	@Column({
		type: DataType.INTEGER({ length: 1 }),
		field: "status"
	})
	status?: number;
}