

const decodingJWT = (token: string) => {
    if (token !== null || token !== undefined) {
        const base64String = token.split('.')[1];
        const decodedValue = JSON.parse(Buffer.from(base64String,
            'base64').toString('ascii'));
        console.log(decodedValue);
        return decodedValue;
    }
    return null;
}

export { decodingJWT };