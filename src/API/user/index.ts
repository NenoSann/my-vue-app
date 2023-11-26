import axios from "axios";
const login = async function (email: string, password: string) {
    return new Promise<any | Error>((resolve, reject) => {
        axios.post('/api/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data);
            resolve(res.data);
        }).catch((error) => {
            reject(error);
        })
    })
}
export { login }