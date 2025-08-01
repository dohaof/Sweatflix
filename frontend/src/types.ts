export interface User {
    id: number;
    username: string;
    phone: string;
    image: string;
    role:Role
}
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
    schedulesId: number[];
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
    scheduleOrders: ScheduleOrder[];
    bookedForCurrentUser: boolean;//frontend only used for button disable
}
export interface VenueScheduleCreation {
    venueId: number;
    startTime: string
    endTime: string;
    capacity: number;
    price: number;
}

export interface ScheduleOrder {
    id: number;
    userId: number;
    venueScheduleId: number;
    orderTime: string;
    paySuccess: boolean;
}
export interface DetailOrder {
    id: number;
    userId: number;
    venueScheduleId: number;
    orderTime: string;
    paySuccess: boolean;
    venueId: number;
    venueName: string;
    venueImage: string;
    startTime: string;
    endTime: string;
    price: number;
}
export interface  BookResponse{
    orderId: number;
    info: string;
}
export interface Comment {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    venueId: number;
    content: string;
    rate: number;
    images: string[];
    thumbUpCount: number;
    createdAt: string;
    hasThumbed: boolean;
}
export interface CommentDTO {
    content: string,
    rate: number,
    images: string[]
}
export interface Notice {
    id: number;
    text: string;
    content: string;
    venueId : number;
    venueName: string;
    createTime: string;
    read: boolean;
}