export type MovieType = {
    name:string;
    id:string;
    seat_available:number;
    show_time:string
};
export type User = {
    first_name:string;
    last_name:string;
    id:string;
    profilePicture?:string;
    key?:string;
    createdAt:string;
    udpatedAt:string;
    role:"USER" | "ADMIN";
    email:string;
}
export type TicketType = {
    id:string;
    userID:string;
    status:"CONFIRM" | "CANCELLED";
    movieId:string;
    createdAt:string;
    updatedAt:string;
    movie:MovieType & {createdAt:string, updatedAt:string},
}