function url(router, file) {
    return `/sdrs/${router}/${file ?? ''}`;
}
function path(file) {
    return `http://218.32.100.27:1200/remote.php/dav/files/team-fire/Videos/${file}`;
}