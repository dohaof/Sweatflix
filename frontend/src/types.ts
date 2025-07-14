export interface User {
    id: number;
    username: string;
    phone: string;
    image: string;
    role:Role
}
// const Role = {
//     admin: 'admin',
//     norm: 'norm'
// } as const;
//
// export type Role = typeof Role[keyof typeof Role];
export  type Role = 'norm' | 'admin'
// 场地类型
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
    id: number;
    username: string;
    newPassword: string;
    oldPassword: string;
    image: string;
}
export interface Venue {
    id: number;
    name: string;
    description: string;
    image: string;
    scheduleId: number[];
}
export interface VenueChange {
    id: number;
    name: string;
    description: string;
    image: string;
}
export interface VenueCreation {
    name: string;
    description: string;
    image: string;
}

// 场地排程
export interface VenueSchedule {
    id: number;
    venueId: number;
    startTime: string
    endTime: string;
    capacity: number;
    price: number;
    autoRenew: boolean;
    scheduleOrderId: number[];
}
export interface VenueScheduleCreation {
    venueId: number;
    startTime: string
    endTime: string;
    capacity: number;
    price: number;
    autoRenew: boolean;
}

export interface ScheduleOrder {
    id: number;
    userId: number;
    venueScheduleId: number;
    orderId: string;
    paySuccess: boolean;
}
