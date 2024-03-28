import { ItemsResponse, IFriend } from '../../Interface/Response';
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

function queryFriends(url: string): Promise<ItemsResponse<IFriend>>;
function queryFriends(userId: string, limit?: number, offset?: number): Promise<ItemsResponse<IFriend>>;
async function queryFriends(urlOrUserId: string, limit?: number, offset?: number): Promise<ItemsResponse<IFriend>> {
    return new Promise((resolve, reject) => {
        if (limit === undefined && offset === undefined) {
            axios.get(urlOrUserId).then((res) => {
                resolve(res.data);
            }).catch((error) => reject(error));
        } else {
            axios.get('/api/friends/', {
                params: {
                    userId: urlOrUserId,
                    limit,
                    offset
                }
            }).then((res) => resolve(res.data)).catch((err) => reject(err));
        }
    })
}


export { login, queryFriends }