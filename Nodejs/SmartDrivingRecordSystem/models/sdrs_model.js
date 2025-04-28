// models/userModel.js
const axios = require('axios');
const xml2js = require('xml2js');
const nextcloudUrl = 'http://218.32.100.27:1200/remote.php/dav/files/team-fire/Videos/';
const username = 'team-fire';
const password = 'teamfire1234';

const FileModel = {
    getFiles: async function getFiles() {
        try {
            const response = await axios({
                method: 'PROPFIND',
                url: nextcloudUrl,
                auth: {
                    username: username,
                    password: password,
                },
                headers: { 
                    'Depth': '1', 
                    'Content-Type': 'application/xml' 
                },
            });
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(response.data);
            return JSON.stringify(result, undefined, 2); //prettier json
            
        } catch (error) {
            throw new Error('Error fetching files:', error);
        }
    }
};

module.exports = FileModel;
