const url = 'http://218.32.100.27:1200/remote.php/dav/files/team-fire/MEME50/期末專題《智慧校園》/SDRS_Videos/';
const username = 'team-fire';
const password = 'teamfire1234';
function get_full_path(filename) {
    return url + (filename ?? '')
}

function axios_api(method, file) {
    return {
        method: method,
        url: get_full_path(file),
        auth: {
            username: username,
            password: password,
        },
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            'Depth': '1',
            'Content-Type': 'application/xml'
        },
    }
}

exports.url = url;
exports.username = username;
exports.password = password;
exports.axios_api = axios_api;
