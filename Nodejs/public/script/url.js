function url(router, file) {
    return `http://localhost:7000/sdrs/${router}/${file ?? ''}`;
}