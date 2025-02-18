import { Model, Table, Column, DataType } from "sequelize-typescript";
import { db_end, db_start } from "../config/config";

export interface IUser {
	id?: number;
	unique_id?: string;
	fullname?: string;
	description?: string;
	fee?: number;
	priority_fee?: number;
	profile_image?: string;
	profile_image_public_id?: string;
	status?: number;
}

@Table({
	tableName: `${db_start}users${db_end}`
})
export default class User extends Model {
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
		type: DataType.STRING(500),
		allowNull: false,
		field: "fullname"
	})
	fullname?: string;
	
	@Column({
		type: DataType.TEXT,
		allowNull: true,
		field: "description"
	})
	description?: string;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
		field: "fee"
	})
	fee?: number;

	@Column({
		type: DataType.FLOAT,
		allowNull: true,
		field: "priority_fee"
	})
	priority_fee?: number;

	@Column({
		type: DataType.STRING(500),
		allowNull: true,
		field: "profile_image"
	})
	profile_image?: string;

	@Column({
		type: DataType.STRING(500),
		allowNull: true,
		field: "profile_image_public_id"
	})
	profile_image_public_id?: string;

	@Column({
		type: DataType.INTEGER({ length: 1 }),
		field: "status"
	})
	status?: number;
}