import { HTTP_STATUS_CODE } from "../utils/helper.js";
import { retrieveVector, storeVector } from "../utils/pinecone.js";
import path from 'path'

export const getQueryResponse = async (req, res) => {
    const query = req.body.query?.trim();

    if (!query) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            success: false,
            data: null,
            message: 'Bad request. Query is required.',
            error: 'ValidationError',
        })
    }

    try {
        const response = await retrieveVector(query)
        res.status(HTTP_STATUS_CODE.OK).json({
            success: true,
            data: response,
            message: 'Response fetched successfully',
            error: null,
        })
    }
    catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: null,
            message: `Error fetching response`,
            error: error?.message ?? JSON.stringify(error),
        })
    }
}

export const uploadFile = async (req, res) => {

    if (!req.file) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            success: false,
            message: 'No file provided',
            error: 'ValidationError',
        });
    }

    try {
        const buffer = req.file.buffer;
        const extension = path.extname(req.file.originalname)
        await storeVector(new Blob([buffer]), extension)
        res.status(HTTP_STATUS_CODE.CREATED).json({
            success: true,
            message: 'File uploaded successfully',
            error: null,
        });
    }
    catch (err) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `Error uploading file`,
            error: err?.message ?? JSON.stringify(err),
        });
    }
}