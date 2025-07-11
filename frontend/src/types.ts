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
export interface Venue {
    capacity: ReactNode;
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;

    schedule: VenueSchedule[];
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
    scheduleOrder: ScheduleOrder[];
}
export interface ScheduleOrder {
    id: number;
    userId: number;
    venueScheduleId: number;
    orderId: string;
    paySuccess: boolean;
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
    id: number;
    username: string;
    newPassword: string;
    oldPassword: string;
    image: string;
}