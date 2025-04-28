// models/userModel.js
const axios = require('axios');
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
            return response.data; // 返回原始 XML 響應
            
        } catch (error) {
            throw new Error('Error fetching files:', error);
        }
    }
};

module.exports = FileModel;
