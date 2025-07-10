export interface User {
    id: number;
    username: string;
    phone: string;
    image: string;
    role:Role
}
const Role = {
    admin: 'admin',
    norm: 'norm'
} as const;

export type Role = typeof Role[keyof typeof Role];

// const FormType = {
//     LoginType:"LoginType",
//     RegisterType:"RegisterType",
//     ModifyType:"ModifyType",
// } as const;
//
// export type FormType = typeof FormType[keyof typeof FormType];
// 场地类型
export interface Venue {
    id: number;
    name: string;
    image: string;
    schedule: VenueItem[];
}


// 场地排程
export interface VenueItem {
    id: number;
    TimeStamp: Date;
    image: string;
    capacity: number;
    attendees: User[];
}
// 登录凭证类型
export interface Credentials {
    phone: string;
    password: string;
}
export interface RegisterForm {
    username: string;
    password: string;
    phone: string;
    image: string;
    role:Role
}
export interface ModifyForm {
    username: string;
    newPassword: string;
    oldPassword: string;
    image: string;
}