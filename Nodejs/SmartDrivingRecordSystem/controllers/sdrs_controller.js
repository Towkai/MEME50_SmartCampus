const sdrs_model = require('../models/sdrs_model');

const SDRS_Controller = {
    getFiles: async function listFiles(req, res) {
        try {
            const xmlData = await sdrs_model.getFiles();
            res.send(`<pre>${xmlData}</pre>`); // 直接顯示原始 XML
        } catch (error) {
            res.status(500).send('Error retrieving files');
        }
    }
};

module.exports = SDRS_Controller;