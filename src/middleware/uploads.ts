import axios from 'axios';
import { clouder_url } from '../config/config';

export const deleteImage = async function (key: string | undefined, payload: any) {
	try {
		const response = await axios.delete(
			`${clouder_url}/remove/file`,
			{
				data: {
					key,
					...payload
				}
			},
		);
		return { err: false, data: response.data };
	} catch (error: any) {
		return { err: true, error, response_code: error.response.status };
	}
};

