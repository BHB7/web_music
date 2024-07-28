import axios from "axios"

const clientId = '44db08558c524229b0b7abab00b30824'
const clientSecret = '069f0e6687b94002a05a387e3f0cd53e'

export const getToken = () => {
    const credentials = clientId + ':' + clientSecret;
    const encodedCredentials = btoa(credentials);

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    return axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
            'Authorization': 'Basic ' + encodedCredentials,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
