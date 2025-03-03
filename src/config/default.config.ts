import { v4 as uuidv4 } from 'uuid';
import { logger } from '../common/index';
import APP_DEFAULT, { IAppDefault } from "../models/appDefault.model";
import API_KEY, { IApiKey } from "../models/apiKey.model";
import { default_app_values, default_status, random_uuid } from '../config/config';

export async function createAppDefaults() {

	const count = await APP_DEFAULT.count();

	if (count <= 0) {
		try {
			await APP_DEFAULT.sequelize?.transaction((t) => {
				const appDefaults = APP_DEFAULT.bulkCreate(default_app_values, { transaction: t });
				return appDefaults;
			})
			logger.info('Added app defaults');
		} catch (error) {
			logger.error(error)
			logger.error('Error adding app defaults');
		}
	}
};

export async function createApiKeys() {

	const details = [
		{
			unique_id: uuidv4(),
			type: "Root",
			api_key: random_uuid(20),
			status: default_status
		},
		{
			unique_id: uuidv4(),
			type: "Internal",
			api_key: random_uuid(20),
			status: default_status
		}
	];

	const count = await API_KEY.count();

	if (count <= 0) {
		try {
			await API_KEY.sequelize?.transaction((t) => {
				const apikey = API_KEY.bulkCreate(details, { transaction: t });
				return apikey;
			})
			logger.info('Added api keys defaults');
		} catch (error) {
			logger.error('Error adding api keys defaults');
		}
	}
};
