import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import { resolve } from 'dns';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),//create
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),//edit
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),//delete
}

//activities feature. all of our activitues rquests will go inside an activities object

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

export default  {
    Activities
}