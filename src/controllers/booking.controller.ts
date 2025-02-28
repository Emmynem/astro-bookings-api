import { Request, Response } from "express";
import { Op } from "sequelize";
import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import BOOKING, { IBooking } from "../models/booking.model";
import USER, { IUser } from "../models/user.model";
import { IGetAuthTypesRequest } from "../middleware/checks";
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, BadRequestError, logger } from '../common/index';
import {
	IPagination, ISearch, default_status, paginate, return_all_letters_uppercase, today_str_alt, random_uuid, completed, processing, anonymous
} from '../config/config';
import { deleteImage } from '../middleware/uploads';

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret } = process.env;

export default class BookingController {
	async getBookings(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const queryParams: IPagination = req.query;

		const total_records = await BOOKING.count();
		const pagination = paginate(queryParams.page || parseInt(req.body.page), queryParams.size || parseInt(req.body.size), total_records);
		const orderBy = queryParams.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(queryParams.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		try {
			const response = await BOOKING.findAndCountAll({
				attributes: { exclude: ['id'] },
				order: [
					[orderBy, sortBy]
				],
				include: [
					{
						model: USER,
						attributes: ['unique_id', 'fullname', 'fee', 'priority_fee', 'profile_image'],
					}
				],
				distinct: true,
				offset: pagination.start,
				limit: pagination.limit
			});

			if (response.count === 0) {
				return SuccessResponse(res, { unique_id: api_key, text: "Bookings Not found" }, []);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "Bookings loaded" }, { ...response, pages: pagination.pages });
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async getBookingStats(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		try {
			const total_bookings = await BOOKING.count();

			const total_bookings_via_booking_status = await BOOKING.findAll({
				attributes: ["booking_status", [BOOKING.sequelize!.fn('count', BOOKING.sequelize!.col('id')), 'total_count']],
				group: "booking_status"
			});

			const booking_sum_via_booking_status = await BOOKING.findAll({
				attributes: [
					"booking_status",
					[BOOKING.sequelize!.fn('sum', BOOKING.sequelize!.col('total_amount')), 'total_amount'],
				],
				group: ["booking_status"]
			});

			return SuccessResponse(res, { unique_id: api_key, text: "Booking Stats loaded" }, { total_bookings, total_bookings_via_booking_status, booking_sum_via_booking_status });
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async getBooking(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		}

		try {
			const response = await BOOKING.findOne({
				attributes: { exclude: ['id'] },
				where: {
					...payload
				},
				include: [
					{
						model: USER,
						attributes: ['unique_id', 'fullname', 'fee', 'priority_fee', 'profile_image'],
					}
				],
			});

			if (!response) {
				return SuccessResponse(res, { unique_id: api_key, text: "Booking Not found" }, null);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "Booking loaded" }, response);
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async getBookingsSpecifically(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		}

		const queryParams: IPagination = req.query;

		const total_records = await BOOKING.count({ where: { ...payload } });
		const pagination = paginate(queryParams.page || parseInt(req.body.page), queryParams.size || parseInt(req.body.size), total_records);
		const orderBy = queryParams.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(queryParams.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		try {
			const response = await BOOKING.findAndCountAll({
				attributes: { exclude: ['id'] },
				where: {
					...payload
				},
				order: [
					[orderBy, sortBy]
				],
				include: [
					{
						model: USER,
						attributes: ['unique_id', 'fullname', 'fee', 'priority_fee', 'profile_image'],
					}
				],
				distinct: true,
				offset: pagination.start,
				limit: pagination.limit
			});

			if (response.count === 0) {
				return SuccessResponse(res, { unique_id: api_key, text: "Bookings Not found" }, []);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "Bookings loaded" }, { ...response, pages: pagination.pages });
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async searchBookings(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const queryParams: IPagination = req.query;

		const total_records = await BOOKING.count({
			where: {
				[Op.or]: [
					{
						fullname: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
					},
					{
						email: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
					},
					{
						phone_number: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
					},
				]
			},
		});
		const pagination = paginate(queryParams.page || parseInt(req.body.page), queryParams.size || parseInt(req.body.size), total_records);
		const orderBy = queryParams.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(queryParams.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		try {
			const response = await BOOKING.findAndCountAll({
				attributes: { exclude: ['id'] },
				where: {
					[Op.or]: [
						{
							fullname: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
						},
						{
							email: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
						},
						{
							phone_number: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
						},
					]
				},
				order: [
					[orderBy, sortBy]
				],
				include: [
					{
						model: USER,
						attributes: ['unique_id', 'fullname', 'fee', 'priority_fee', 'profile_image'],
					}
				],
				distinct: true,
				offset: pagination.start,
				limit: pagination.limit
			});

			if (response.count === 0) {
				return SuccessResponse(res, { unique_id: api_key, text: "Bookings Not found" }, []);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "Bookings loaded" }, { ...response, pages: pagination.pages });
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async addBooking(req: IGetAuthTypesRequest, res: Response) {
		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array());
		}

		try {
			const user_details = await USER.findOne({
				attributes: { exclude: ['id'] },
				where: { unique_id: payload.user_unique_id }
			});

			if (!user_details) {
				return BadRequestError(res, { unique_id: anonymous, text: "User Not found" }, null);
			}
			
			if (payload.priority && !user_details.priority_fee) {
				return BadRequestError(res, { unique_id: anonymous, text: "No priority fee available" }, null);
			}

			await BOOKING.sequelize?.transaction(async (transaction) => {
				const bookingResponse = await BOOKING.create({
					unique_id: uuidv4(),
					user_unique_id: payload.user_unique_id,
					fullname: payload.fullname,
					email: payload.email,
					phone_number: payload.phone_number ? payload.phone_number : null,
					amount: user_details.fee,
					priority_amount: payload.priority ? (!user_details.priority_fee ? null : user_details.priority_fee) : null,
					total_amount: payload.priority && user_details.fee && user_details.priority_fee ? user_details.fee + user_details.priority_fee : user_details.fee,
					details: payload.details ? payload.details : null,
					proof_image: payload.proof_image ? payload.proof_image : null,
					proof_image_public_id: payload.proof_image_public_id ? payload.proof_image_public_id : null,
					topup_proof_image: payload.topup_proof_image ? payload.topup_proof_image : null,
					topup_proof_image_public_id: payload.topup_proof_image_public_id ? payload.topup_proof_image_public_id : null,
					booking_status: processing,
					status: default_status
				}, { transaction });

				if (bookingResponse) {
					return SuccessResponse(res, { unique_id: anonymous, text: "Booking added successfully!" }, { unique_id: bookingResponse.unique_id, amount: bookingResponse.amount, priority_amount: bookingResponse.priority_amount, total_amount: bookingResponse.total_amount, booking_status: bookingResponse.booking_status });
				} else {
					throw new Error("Error adding booking");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}

	async updateBookingTopupProof(req: IGetAuthTypesRequest, res: Response) {
		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
		}

		try {
			const booking_details = await BOOKING.findOne({
				attributes: { exclude: ['id'] },
				where: { unique_id: payload.unique_id }
			});

			if (!booking_details) {
				return BadRequestError(res, { unique_id: anonymous, text: "Booking Not found" }, null);
			}

			await BOOKING.sequelize?.transaction(async (transaction) => {
				const response = await BOOKING.update(
					{
						topup_proof_image: payload.topup_proof_image ? payload.topup_proof_image : null,
						topup_proof_image_public_id: payload.topup_proof_image_public_id ? payload.topup_proof_image_public_id : null,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (response[0] > 0) {
					SuccessResponse(res, { unique_id: anonymous, text: "Details updated successfully!" }, null);

					// Delete former image available
					if (booking_details.topup_proof_image_public_id !== null) {
						await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: booking_details.topup_proof_image_public_id });
					}
				} else {
					throw new Error("Error updating details");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}

	async updateBookingStatus(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		}

		try {
			await BOOKING.sequelize?.transaction(async (transaction) => {
				const response = await BOOKING.update(
					{
						booking_status: payload.booking_status,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (response[0] > 0) {
					return SuccessResponse(res, { unique_id: api_key, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Error updating details");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async deleteBooking(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		}

		try {
			const booking_details = await BOOKING.findOne({
				attributes: { exclude: ['id'] },
				where: { unique_id: payload.unique_id }
			});

			if (!booking_details) {
				return BadRequestError(res, { unique_id: anonymous, text: "Booking Not found" }, null);
			}

			await BOOKING.sequelize?.transaction(async (transaction) => {
				const response = await BOOKING.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							status: default_status
						}
					}
				);

				if (response > 0) {
					SuccessResponse(res, { unique_id: api_key, text: "Booking was deleted successfully!" }, null);

					// Delete former image available
					if (booking_details.proof_image_public_id !== null) {
						await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: booking_details.proof_image_public_id });
					}
					if (booking_details.topup_proof_image_public_id !== null) {
						await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: booking_details.topup_proof_image_public_id });
					}
				} else {
					throw new Error("Error deleting record");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}
};
