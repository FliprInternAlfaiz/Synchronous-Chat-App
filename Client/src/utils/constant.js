export const HOST =import.meta.env.VITE_SERVER_URL;


export const AUTH_ROUTES ="/api/auth";
export const SIGNUP_ROUTES =`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES =`${AUTH_ROUTES}/login`;
export const GET_USER_INFO=`${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE=`${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE=`${AUTH_ROUTES}/logout`;


export const CONTACT_ROUTES="/api/contacts"
export const CONTACT_SEARCH=`${CONTACT_ROUTES}/serach`;
export const GET_CONTACT=`${CONTACT_ROUTES}/get-contact-for-dm`;

export const MESSAGE_ROUTE="/api/messages"
export const GET_ALL_MESSAGE=`${MESSAGE_ROUTE}/get-message`
export const UPLOAD_FILE_ROUTES=`${MESSAGE_ROUTE}/upload-file`
