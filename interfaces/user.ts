export interface UserInterface {
    name: {
        first: string,
        last: string
    },
    email: string,
    zipCode: number,
    courses: object[],
    subscribedAccount: object | undefined
}