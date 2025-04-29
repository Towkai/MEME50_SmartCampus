// models/userModel.js
const axios = require('axios')
const xml2js = require('xml2js');
const nextcloud = require('../nextcloud');

const FileModel = {
    getFiles: async function getFiles() {
        try {
            const response = await axios(nextcloud.axios_api('PROPFIND'));
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(response.data);
            return result; //prettier json
            
        } catch (error) {
            throw new Error('Error fetching files:', error);
        }
    },
    delFile: async function delFile(file) {
        try {
            const response = await axios(nextcloud.axios_api('DELETE', file));
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(response.data);
            return result; //prettier json
            
        } catch (error) {
            throw new Error('Error fetching files:', error);
        }
    }
};

module.exports = FileModel;
