export interface IUser {
    id?: any | null,
    username?: string | null,
    email?: string,
    password?: string,
    repeatedPassword?: string,
    roles?: Array<any>
    numDownloads?: any
    lastDownloadDate?: any
    accessToken: string;
}