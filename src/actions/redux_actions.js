import axios from 'axios';
import RandomToken from 'random-token';
import DealReduxTypes from '../constants/redux_deal_types';
import LoginReduxTypes from '../constants/redux_login_types';
import OneSignal from 'react-native-onesignal';
import NotificationHandler from '../util/NotificationHandler';

//const hostUrl = 'http://10.0.0.107:9999';
const hostUrl = 'https://elimoo-test.herokuapp.com';

export const setCurrentActiveDeal = (deal) => {
    return (dispatch, getState) => {
        dispatch(setActiveDeal(deal))
    }
}
export const getUserDetails = (userId) => {
    return async (dispatch, getState) => {
        dispatch(setUserDetailsLoading(true));

        axios.get(hostUrl+'/')
        .then((res) => {
            dispatch(setUserDetailsSuccess(res.data['test_data']));
        })
        .catch((err) => {
            console.log("Error: ", err);
            dispatch(setUserDetailsLoading(false));
        });
    }
};

export const getPendingStatus = (userId) => {
    return async (dispatch, getState) => {
        dispatch(setPendingCheckLoading(true));

        axios.get(hostUrl+'/api/user/pendingstatus/'+userId)
        .then((res) => {
            console.log("Response: ", res.data);
            if(res.data['status'] == 'success'){
                dispatch(setPendingCheckSuccess(res.data['data'], res.data['pending_status']));
            }else{
                dispatch(setPendingCheckError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setPendingCheckError('network_error'));
        });
    }
};
export const getPendingStatusBackground = (userId) => {
    return async (dispatch, getState) => {
        //dispatch(setPendingCheckLoading(true));
        
        axios.get(hostUrl+'/api/user/pendingstatus/'+userId)
        .then((res) => {
            console.log("Response: ", res.data);
            if(res.data['status'] == 'success'){
                dispatch(setPendingCheckSuccess(res.data['data'], res.data['pending_status']));
            }else{
                dispatch(setPendingCheckError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setPendingCheckError('network_error'));
        });
    }
};

export const loginUser = (email, password) => {
    return async (dispatch, getState) => {
        dispatch(setUserLoginLoading(true));

        axios.post(hostUrl+'/api/user/login', {
            email: email,
            password: password
        })
        .then((res) => {
            console.log("Response: ", res.data);
            console.log("AllResponse: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setUserLoginSuccess(res.data['data']));
            }else{
                dispatch(setUserLoginError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setUserLoginError('network_error'));
        });
    }
};
export const loginUserGoogle = (first_name, last_name, email, google_id) => {
    return async (dispatch, getState) => {
        dispatch(setUserLoginLoading(true));

        axios.post(hostUrl+'/api/user/googlelogin', {
            first_name: first_name,
            last_name: last_name,
            email: email,
            google_id: google_id,
        })
        .then((res) => {
            console.log("Response: ", res.data['data']);
            if(res.data['status'] == 'success'){
                dispatch(setUserLoginSuccess(res.data['data']));
            }else{
                dispatch(setUserLoginError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setUserLoginError('network_error'));
        });
    }
};
export const loginUserFacebook = (first_name, last_name, email, facebook_id) => {
    return async (dispatch, getState) => {
        dispatch(setUserLoginLoading(true));

        axios.post(hostUrl+'/api/user/facebooklogin', {
            first_name: first_name,
            last_name: last_name,
            email: email,
            facebook_id: facebook_id,
        })
        .then((res) => {
            console.log("Response: ", res.data['data']);
            if(res.data['status'] == 'success'){
                dispatch(setUserLoginSuccess(res.data['data']));
            }else{
                dispatch(setUserLoginError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setUserLoginError('network_error'));
        });
    }
};

export const registerUser = (firstName, lastName, email, gender, password, date_of_birth) => {
    return async (dispatch, getState) => {
        dispatch(setUserRegisterLoading(true));

        axios.post(hostUrl+'/api/user/register', {
            first_name: firstName,
            last_name: lastName,
            email: email,
            gender: gender,
            password: password,
            date_of_birth: date_of_birth,
        })
        .then((res) => {
            console.log("Response: ", res.data['message']);
            if(res.data['status'] == 'success'){
                dispatch(setUserRegisterSuccess(res.data['data']));
            }else{
                dispatch(setUserRegisterError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setUserRegisterError('network_error'));
        });
    }
};

export const changeUserPassword = (userId, currentPassword, newPassword) => {
    return async (dispatch, getState) => {
        dispatch(setChangePasswordLoading(true));

        axios.post(hostUrl+'/api/user/changepassword', {
            userId: userId,
            currentPassword: currentPassword,
            newPassword: newPassword,
        })
        .then((res) => {
            console.log("Response: ", res.data['message']);
            if(res.data['status'] == 'success'){
                dispatch(setChangePasswordSuccess(res.data['message']));
            }else{
                dispatch(setChangePasswordError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios', err);
            dispatch(setChangePasswordError('network_error'));
        });
    }
};

export const userForgotPassword = (email) => {
    return async (dispatch, getState) => {
        dispatch(setForgotPasswordLoading(true));

        axios.post(hostUrl+'/api/user/forgotpassword', {
            email: email,
        })
        .then((res) => {
            console.log("Response: ", res.data['message']);
            if(res.data['status'] == 'success'){
                dispatch(setForgotPasswordSuccess(res.data['message']));
            }else{
                dispatch(setForgotPasswordError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios', err);
            dispatch(setForgotPasswordError('network_error'));
        });
    }
};


export const updateUserDetails = (userId, data) => {
    return async (dispatch, getState) => {
        dispatch(setUserUpdateLoading(true));

        axios.put(hostUrl+'/api/user/'+userId, data)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setUserUpdateSuccess(res.data['data']));
            }else{
                dispatch(setUserUpdateError(res.data['message']));
            }
        })
        .catch((err) => {
            dispatch(setUserUpdateError('network_error'));
        });
    }
};

export const updateUserInstituitionEmail = (userId, data) => {
    return async (dispatch, getState) => {
        dispatch(setUserEmailUpdateLoading(true));

        axios.put(hostUrl+'/api/user/email_confirmation/'+userId, data)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setUserEmailUpdateSuccess(res.data['data']));
            }else{
                dispatch(setUserEmailUpdateError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setUserEmailUpdateError('network_error'));
        });
    }
};
export const getCategoryDeals = (category, page, is_store) => {
    return async (dispatch, getState) => {
        dispatch(setCategoryDealLoading(true));
        var data = {
            category: category,
            page: page,
            is_store: is_store,
        };

        axios.post(hostUrl+'/api/deal/category', data)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setCategoryDealSuccess(res.data['message'], res.data['data']));
            }else{
                dispatch(setCategoryDealError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setCategoryDealError('network_error'));
        });
    }
};
var cancel = null;
var CancelToken = axios.CancelToken;
export const searchDeals = (searchTerm, searchType, page) => {
    if(searchTerm == '') return;
    if (cancel != undefined && cancel != null) {
        cancel();
    }
    return async (dispatch, getState) => {
        dispatch(setSearchDealLoading(true));
        var data = {
            searchTerm: searchTerm,
            searchType: searchType,
            page: page
        };

        axios.post(hostUrl+'/api/deal/search', data, {
            cancelToken: new CancelToken(function executor(c){
                cancel = c;
            })
        })
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setSearchDealSuccess(res.data['message'], res.data['data']));
            }else{
                dispatch(setSearchDealError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            if (axios.isCancel(err)) {
            }else{
                dispatch(setSearchDealError('network_error'));
            }
        });
    }
};

export const verifyUserInstituitionEmail = (data) => {
    return async (dispatch, getState) => {
        dispatch(setUserEmailVerifyLoading(true));

        axios.post(hostUrl+'/api/user/verify/confirmation_email', data)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setUserEmailVerifySuccess(res.data['data']));
            }else{
                dispatch(setUserEmailVerifyError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setUserEmailVerifyError('network_error'));
        });
    }
};
export const resendUserVerificationEmail = (userID) => {
    return async (dispatch, getState) => {
        dispatch(setUserEmailVerifyLoading(true));

        axios.get(hostUrl+'/api/user/verify/resend_email/'+userID)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setUserEmailVerifyError('resend_email_complete'));
            }else{
                dispatch(setUserEmailVerifyError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setUserEmailVerifyError('network_error'));
        });
    }
};

//Deals:
export const getUserFavouriteDeals = (userId, isHome) => {
    return async (dispatch, getState) => {
        dispatch(setFavouriteDealsLoading(true));
        dispatch(setGetUserNotificationsLoading(true));
        if(isHome){
            dispatch(setHomeDealsLoading(true));      
        }

        axios.get(hostUrl+'/api/deal/favourite/'+userId)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setFavouriteDealsSuccess(res.data['data']));
                if(isHome){
                    dispatch(getUserHomeDeals(userId));
                }
            }else{
                dispatch(setFavouriteDealsError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setFavouriteDealsError('network_error'));
        });
    }
};
export const getUserHomeDeals = (userId) => {
    return async (dispatch, getState) => {
        axios.get(hostUrl+'/api/deal/home')
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setHomeDealsSuccess(res.data['data'], res.data['top_tips']));
                dispatch(getUserNotifications(userId));     
            }else{
                dispatch(setHomeDealsError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setHomeDealsError('network_error'));
        });
    }
};
export const likeDealHome = (userId, deal) => {
    return async (dispatch, getState) => {
        if(userId =='--guest-user--') return;
        var dealId = deal['id'];
        dispatch(addLikeDeal(deal));
        axios.get(hostUrl+'/api/deal/like/'+userId+'/'+dealId)
        .then((res) => {
            console.log("Resp:", res);
            if(res.data['status'] == 'error'){
                dispatch(setLikeDealError(dealId, 'network_error'));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setLikeDealError(dealId, 'network_error'));
        });
    }
};
export const unlikeDealHome = (userId, deal) => {
    return async (dispatch, getState) => {
        if(userId =='--guest-user--') return;
        var dealId = deal['id'];
        dispatch(removeLikeDeal(dealId));
        axios.get(hostUrl+'/api/deal/unlike/'+userId+'/'+dealId)
        .then((res) => {
            console.log("Resp:", res);
            if(res.data['status'] == 'error'){
                dispatch(setUnlikeDealError(deal, 'network_error'));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setUnlikeDealError(deal, 'network_error'));
        });
    }
};
export const checkDealAvailability = (userId, dealId) => {
    return async (dispatch, getState) => {
        dispatch(setCheckAvailabilityLoading(true))
        axios.get(hostUrl+'/api/deal/availability/'+userId+'/'+dealId)
        .then((res) => {
            console.log("Resp:", res);
            if(res.data['status'] == 'error'){
                dispatch(setCheckAvailabilityError(res.data['message']));
            }else{
                dispatch(setCheckAvailabilitySuccess(res.data['message'], res.data['data']))
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setCheckAvailabilityError('network_error'));
        });
    }
};
export const redeemDeal = (userId, dealId) => {
    return async (dispatch, getState) => {
        dispatch(setRedeemDealLoading(true));
        axios.get(hostUrl+'/api/deal/redeem/'+userId+'/'+dealId)
        .then((res) => {
            console.log("Resp:", res);
            if(res.data['status'] == 'error'){
                dispatch(setRedeemDealError(res.data['message']));
            }else{
                dispatch(setRedeemDealSuccess(res.data['message'], res.data['data']))
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setRedeemDealError('network_error'));
        });
    }
};

//Notifications
export const getUserNotifications = (userId) => {
    return async (dispatch, getState) => {
        //dispatch(setGetUserNotificationsLoading(true));

        axios.get(hostUrl+'/api/user/notifications/'+userId)
        .then((res) => {
            console.log("Response: ", res);
            if(res.data['status'] == 'success'){
                dispatch(setGetUserNotificationsSuccess(res.data['data']));
            }else{
                dispatch(setGetUserNotificationsError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setGetUserNotificationsError('network_error'));
        });
    }
};


export const guestUser = () => {
    return (dispatch, getState) => {
        var USER = {};
        USER['id'] = '--guest-user--';
        USER['first_name'] = '';
        USER['last_name'] = '';
        USER['instituition_name'] = '';
        USER['instituition_email'] = 'null';
        USER['is_approved'] = true;
        USER['is_instituition_email_confirmed'] = true;
        USER['profile_image_url'] = 'null';
        USER['date_of_birth'] = new Date();
        USER['gender'] = 'null';
        USER['user_settings'] = null;
        USER['student_proof_image_url'] = '';
        USER['expiry_date'] = null;
        
        dispatch(setUserLoginSuccess(USER));
    }
};
export const clearGuestUser = () => {
    return (dispatch, getState) => {
        dispatch(resetAuthReducerStore());
    }
};

export const clearLoginError = () => {
    return (dispatch, getState) => {
        dispatch(setUserLoginError(null));
    }
};
export const clearRegisterError = () => {
    return (dispatch, getState) => {
        dispatch(setUserRegisterError(null));
    }
};
export const clearSelfieError = () => {
    return (dispatch, getState) => {
        dispatch(setSelfieUploadError(null));
    }
};
export const clearProofError = () => {
    return (dispatch, getState) => {
        dispatch(setProofUploadError(null));
    }
};
export const clearUpdateError = () => {
    return (dispatch, getState) => {
        dispatch(setUserUpdateError(null));
    }
};
export const clearUpdateSuccessVar = () => {
    return (dispatch, getState) => {
        dispatch(clearUpdateSuccess(null));
    }
};
export const clearEmailUpdateError = () => {
    return (dispatch, getState) => {
        dispatch(setUserEmailUpdateError(null));
    }
};
export const clearEmailVerifyError = () => {
    return (dispatch, getState) => {
        dispatch(setUserEmailVerifyError(null));
    }
};
export const clearEmailUpdateSuccessVar = () => {
    return (dispatch, getState) => {
        dispatch(clearEmailUpdateSuccess(null));
    }
};
export const clearPendingCheckError = () => {
    return (dispatch, getState) => {
        dispatch(setPendingCheckError(null));
    }
};
export const clearPendingCheckSuccess = () => {
    return (dispatch, getState) => {
        dispatch(setPendingCheckSuccess(null, null));
    }
};
export const clearFavouriteDealsError = () => {
    return (dispatch, getState) => {
        dispatch(setFavouriteDealsError(null));
    }
};
export const clearGetUserNotificationsError = () => {
    return (dispatch, getState) => {
        dispatch(setGetUserNotificationsError(null));
    }
};

export const setSettingsPushNotificationsEnabled = (enabled) => {
    return (dispatch, getState) => {
        OneSignal.setSubscription(enabled);
        if(enabled){
            OneSignal.init("9986f240-b0ac-463b-816d-8ff06175b69b", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
            OneSignal.addEventListener('received', (notification) => {
                console.log("Notification Received: ", notification);
                if(NotificationHandler.notificationCallback != null && NotificationHandler.notificationCallback != undefined)
                NotificationHandler.notificationCallback();
            });
        }
        dispatch(setPushNotificationsEnabled(enabled));
    }
};

export const removeUserNotification = (id) => {
    return (dispatch, getState) => {
        dispatch(removeCurrentUserNotification(id));
    }
};

export const clearCheckAvailabilityError = () => {
    return (dispatch, getState) => {
        dispatch(setCheckAvailabilityError(null));
    }
};
export const clearCheckAvailabilitySuccess = () => {
    return (dispatch, getState) => {
        dispatch(setCheckAvailabilitySuccess(null, null));
    }
};
export const clearRedeemDealError = () => {
    return (dispatch, getState) => {
        dispatch(setRedeemDealError(null));
    }
};
export const clearRedeemDealSuccess = () => {
    return (dispatch, getState) => {
        dispatch(setRedeemDealSuccess(null, null));
    }
};
export const clearCategoryDealsError = () => {
    return (dispatch, getState) => {
        dispatch(setCategoryDealError(null));
    }
};
export const clearCategoryDealsSuccess = () => {
    return (dispatch, getState) => {
        dispatch(setCategoryDealSuccess(null, null));
    }
};
export const clearSearchDealsError = () => {
    return (dispatch, getState) => {
        dispatch(setSearchDealError(null));
    }
};
export const clearSearchDealsSuccess = () => {
    return (dispatch, getState) => {
        dispatch(setSearchDealSuccess(null, null));
    }
};
export const clearSearchDealsSuccessComplete = () => {
    return (dispatch, getState) => {
        dispatch(setSearchDealSuccess('not_complete', null));
    }
};
export const clearHomeDealsError = () => {
    return (dispatch, getState) => {
        dispatch(setHomeDealsError(null));
    }
};

export const clearChangePasswordError = () => {
    return (dispatch, getState) => {
        dispatch(setChangePasswordError(null));
    }
};
export const clearChangePasswordSuccess = () => {
    return (dispatch, getState) => {
        dispatch(setChangePasswordSuccess(null));
    }
};
export const clearForgotPasswordError = () => {
    return (dispatch, getState) => {
        dispatch(setForgotPasswordError(null));
    }
};
export const clearForgotPasswordSuccess = () => {
    return (dispatch, getState) => {
        dispatch(setForgotPasswordSuccess(null));
    }
};

export const resetAuthStore = () => {
    return (dispatch, getState) => {
        dispatch(resetAuthReducerStore());
    }
};

export const stopAllLoading = () => {
    return (dispatch, getState) => {
        dispatch(setUserLoginLoading(false));
        dispatch(setSelfieUploadLoading(false));
        dispatch(setProofUploadLoading(false));
        dispatch(setUserRegisterLoading(false));
        dispatch(setUserEmailUpdateLoading(false));
        dispatch(setUserEmailVerifyLoading(false));
        dispatch(setUserDetailsLoading(false));
        dispatch(setUserUpdateLoading(false));
        dispatch(setFavouriteDealsLoading(false));
        dispatch(setCheckAvailabilityLoading(false));
        dispatch(setChangePasswordLoading(false));
        dispatch(setGetUserNotificationsLoading(false));
        dispatch(setSearchDealLoading(false));
        dispatch(setHomeDealsLoading(false));
        dispatch(setCategoryDealLoading(false));
    }
};

export const uploadProfileImage = (userId, imagePath, mimeType) => {
    return async (dispatch, getState) => {
        dispatch(setSelfieUploadLoading(true));

        var imageName = RandomToken(16)+new Date().getTime();
        imageName += (mimeType === 'image/jpeg' ? '.jpg' : '.png');

        imagePath = Platform.OS == 'android' ? imagePath : imagePath.replace('file://', '');

        const formData = new FormData();
        formData.append('profile_image', {
            name: imageName,
            uri: imagePath,
            type: mimeType
        });
        
        axios({
            method: 'post',
            url: hostUrl+'/api/user/profile_image/'+userId,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
        .then((res) => {
            console.log("Response: ", res.data);
            if(res.data['status'] == 'success'){
                dispatch(setSelfieUploadSuccess(res.data['data']));
            }else{
                dispatch(setSelfieUploadError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setSelfieUploadError('network_error'));
        });
    }
};

export const uploadStudentProofImage = (userId, imagePath, mimeType) => {
    return async (dispatch, getState) => {
        dispatch(setProofUploadLoading(true));

        var imageName = RandomToken(16)+new Date().getTime();
        imageName += (mimeType === 'image/jpeg' ? '.jpg' : '.png');

        imagePath = Platform.OS == 'android' ? imagePath : imagePath.replace('file://', '');

        const formData = new FormData();
        formData.append('proof_image', {
            name: imageName,
            uri: imagePath,
            type: mimeType
        });
        
        axios({
            method: 'post',
            url: hostUrl+'/api/user/user_proof_image/'+userId,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
        .then((res) => {
            console.log("Response: ", res.data);
            if(res.data['status'] == 'success'){
                dispatch(setProofUploadSuccess(res.data['data']));
            }else{
                dispatch(setProofUploadError(res.data['message']));
            }
        })
        .catch((err) => {
            console.log('Axios: ', err);
            dispatch(setProofUploadError('network_error'));
        });
    }
};


const setUserLoginLoading = (login_loading) => {
    return {
        type: LoginReduxTypes.USER_LOGIN_LOADING, 
        payload: {
            login_loading
        }
    }
};

const setUserLoginSuccess = (user) => ({
    type: LoginReduxTypes.LOGIN_USER_SUCCESS,
    payload: {
      ...user
    }
});

const setUserLoginError = (login_error) => ({
    type: LoginReduxTypes.USER_LOGIN_ERROR,
    payload: {
      login_error
    }
});

const setUserRegisterLoading = (register_loading) => {
    return {
        type: LoginReduxTypes.REGISTER_LOADING, 
        payload: {
            register_loading
        }
    }
};

const setUserRegisterSuccess = (user) => ({
    type: LoginReduxTypes.REGISTER_SUCCESS,
    payload: {
      ...user
    }
});

const setUserRegisterError = (register_error) => ({
    type: LoginReduxTypes.REGISTER_ERROR,
    payload: {
      register_error
    }
});
const clearUpdateSuccess = (user_success) => ({
    type: LoginReduxTypes.CLEAR_UPDATE_SUCCESS,
    payload: {
        user_success
    }
});
const clearEmailUpdateSuccess = (user_success) => ({
    type: LoginReduxTypes.CLEAR_EMAIL_UPDATE_SUCCESS,
    payload: {
        user_success
    }
});

const setUserUpdateLoading = (update_loading) => {
    return {
        type: LoginReduxTypes.USER_UPDATE_LOADING, 
        payload: {
            update_loading
        }
    }
};

const setUserUpdateSuccess = (user) => ({
    type: LoginReduxTypes.USER_UPDATE_SUCCESS,
    payload: {
      ...user
    }
});

const setUserUpdateError = (update_error) => ({
    type: LoginReduxTypes.USER_UPDATE_ERROR,
    payload: {
        update_error
    }
});

const setUserEmailUpdateLoading = (email_update_loading) => {
    return {
        type: LoginReduxTypes.EMAIL_UPDATE_LOADING, 
        payload: {
            email_update_loading
        }
    }
};

const setUserEmailUpdateSuccess = (user) => ({
    type: LoginReduxTypes.EMAIL_UPDATE_SUCCESS,
    payload: {
      ...user
    }
});

const setUserEmailUpdateError = (email_update_error) => ({
    type: LoginReduxTypes.EMAIL_UPDATE_ERROR,
    payload: {
        email_update_error
    }
});

const setSelfieUploadLoading = (selfie_upload_loading) => {
    return {
        type: LoginReduxTypes.SELFIE_UPLOAD_LOADING, 
        payload: {
            selfie_upload_loading
        }
    }
};

const setSelfieUploadSuccess = (user) => ({
    type: LoginReduxTypes.SELFIE_UPLOAD_SUCCESS,
    payload: {
        ...user
    }
});

const setSelfieUploadError = (selfie_upload_error) => ({
    type: LoginReduxTypes.SELFIE_UPLOAD_ERROR,
    payload: {
      selfie_upload_error
    }
});

const setProofUploadLoading = (proof_upload_loading) => {
    return {
        type: LoginReduxTypes.PROOF_UPLOAD_LOADING, 
        payload: {
            proof_upload_loading
        }
    }
};

const setProofUploadSuccess = (user) => ({
    type: LoginReduxTypes.PROOF_UPLOAD_SUCCESS,
    payload: {
        ...user
    }
});

const setProofUploadError = (proof_upload_error) => ({
    type: LoginReduxTypes.PROOF_UPLOAD_ERROR,
    payload: {
      proof_upload_error
    }
});

const setUserEmailVerifyLoading = (email_verify_loading) => {
    return {
        type: LoginReduxTypes.EMAIL_VERIFY_LOADING, 
        payload: {
            email_verify_loading
        }
    }
};

const setUserEmailVerifySuccess = (user) => ({
    type: LoginReduxTypes.EMAIL_VERIFY_SUCCESS,
    payload: {
      ...user
    }
});

const setUserEmailVerifyError = (email_verify_error) => ({
    type: LoginReduxTypes.EMAIL_VERIFY_ERROR,
    payload: {
        email_verify_error
    }
});
const setPendingCheckLoading = (pending_check_loading) => {
    return {
        type: LoginReduxTypes.PENDING_CHECK_LOADING, 
        payload: {
            pending_check_loading
        }
    }
};

const setPendingCheckSuccess = (user, status) => ({
    type: LoginReduxTypes.PENDING_CHECK_SUCCESS,
    status,
    user
});

const setPendingCheckError = (pending_check_error) => ({
    type: LoginReduxTypes.PENDING_CHECK_ERROR,
    payload: {
        pending_check_error
    }
});
const resetAuthReducerStore = () => ({
    type: LoginReduxTypes.RESET_AUTH_STORE
});

//Deals
const setFavouriteDealsLoading = (favourite_deals_loading) => {
    return {
        type: DealReduxTypes.FAVOURITE_DEALS_LOAD_LOADING, 
        payload: {
            favourite_deals_loading
        }
    }
};

const setFavouriteDealsSuccess = (deals) => ({
    type: DealReduxTypes.FAVOURITE_DEALS_LOAD_SUCCESS,
    payload: {
        deals
    }
});

const setFavouriteDealsError = (favourite_deals_error) => ({
    type: DealReduxTypes.FAVOURITE_DEALS_LOAD_ERROR,
    payload: {
        favourite_deals_error
    }
});
const setCheckAvailabilityLoading = (check_availability_loading) => {
    return {
        type: DealReduxTypes.CHECK_AVAILABILITY_LOAD_LOADING, 
        payload: {
            check_availability_loading
        }
    }
};

const setCheckAvailabilitySuccess = (message, data) => ({
    type: DealReduxTypes.CHECK_AVAILABILITY_LOAD_SUCCESS,
    payload: {
        message,
        data
    }
});

const setCheckAvailabilityError = (check_availability_error) => ({
    type: DealReduxTypes.CHECK_AVAILABILITY_LOAD_ERROR,
    payload: {
        check_availability_error
    }
});
const setRedeemDealLoading = (redeem_deal_loading) => {
    return {
        type: DealReduxTypes.REDEEM_DEAL_LOAD_LOADING, 
        payload: {
            redeem_deal_loading
        }
    }
};

const setRedeemDealSuccess = (message, data) => ({
    type: DealReduxTypes.REDEEM_DEAL_LOAD_SUCCESS,
    payload: {
        message,
        data
    }
});

const setRedeemDealError = (redeem_deal_error) => ({
    type: DealReduxTypes.REDEEM_DEAL_LOAD_ERROR,
    payload: {
        redeem_deal_error
    }
});
const setCategoryDealLoading = (category_deals_loading) => {
    return {
        type: DealReduxTypes.CATEGORY_DEALS_LOAD_LOADING, 
        payload: {
            category_deals_loading
        }
    }
};

const setCategoryDealSuccess = (message, data) => ({
    type: DealReduxTypes.CATEGORY_DEALS_LOAD_SUCCESS,
    payload: {
        message,
        data
    }
});

const setCategoryDealError = (category_deals_error) => ({
    type: DealReduxTypes.CATEGORY_DEALS_LOAD_ERROR,
    payload: {
        category_deals_error
    }
});
const setSearchDealLoading = (search_deals_loading) => {
    return {
        type: DealReduxTypes.SEARCH_DEALS_LOAD_LOADING, 
        payload: {
            search_deals_loading
        }
    }
};

const setSearchDealSuccess = (message, data) => ({
    type: DealReduxTypes.SEARCH_DEALS_LOAD_SUCCESS,
    payload: {
        message,
        data
    }
});

const setSearchDealError = (search_deals_error) => ({
    type: DealReduxTypes.SEARCH_DEALS_LOAD_ERROR,
    payload: {
        search_deals_error
    }
});
const setHomeDealsLoading = (home_deals_loading) => {
    return {
        type: DealReduxTypes.HOME_DEALS_LOAD_LOADING, 
        payload: {
            home_deals_loading
        }
    }
};

const setHomeDealsSuccess = (deals, top_tips) => ({
    type: DealReduxTypes.HOME_DEALS_LOAD_SUCCESS,
    payload: {
        deals,
        top_tips
    }
});

const setHomeDealsError = (home_deals_error) => ({
    type: DealReduxTypes.HOME_DEALS_LOAD_ERROR,
    payload: {
        home_deals_error
    }
});


const addLikeDeal = (deal) => ({
    type: DealReduxTypes.ADD_LIKE_DEAL,
    payload: {
        deal
    }
});

const setLikeDealError = (dealId, like_deal_error) => ({
    type: DealReduxTypes.LIKE_DEAL_ERROR,
    payload: {
        dealId,
        like_deal_error
    }
});
const removeLikeDeal = (dealId) => ({
    type: DealReduxTypes.REMOVE_LIKE_DEAL,
    payload: {
        dealId
    }
});

const setUnlikeDealError = (deal, unlike_deal_error) => ({
    type: DealReduxTypes.UNLIKE_DEAL_ERROR,
    payload: {
        deal,
        unlike_deal_error
    }
});
const setActiveDeal = (active_deal) => ({
    type: DealReduxTypes.SET_ACTIVE_DEAL,
    payload: {
        active_deal
    }
});

//Notifications
const setGetUserNotificationsLoading = (get_user_notifications_loading) => {
    return {
        type: DealReduxTypes.GET_USER_NOTIFICATIONS_LOADING, 
        payload: {
            get_user_notifications_loading
        }
    }
};

const setGetUserNotificationsSuccess = (data) => ({
    type: DealReduxTypes.GET_USER_NOTIFICATIONS_SUCCESS,
    payload: {
        data
    }
});

const setGetUserNotificationsError = (get_user_notifications_error) => ({
    type: DealReduxTypes.GET_USER_NOTIFICATIONS_ERROR,
    payload: {
        get_user_notifications_error
    }
});
const removeCurrentUserNotification = (id) => ({
    type: DealReduxTypes.REMOVE_USER_NOTIFICATION,
    payload: {
        id
    }
});
const setPushNotificationsEnabled = (enabled) => ({
    type: LoginReduxTypes.SET_NOTIFICATIONS_ENABLED,
    payload: {
        enabled
    }
});

//Settings
const setChangePasswordLoading = (change_password_loading) => {
    return {
        type: LoginReduxTypes.CHANGE_PASSWORD_LOADING, 
        payload: {
            change_password_loading
        }
    }
};

const setChangePasswordSuccess = (result) => ({
    type: LoginReduxTypes.CHANGE_PASSWORD_SUCCESS,
    payload: {
        result
    }
});

const setChangePasswordError = (change_password_error) => ({
    type: LoginReduxTypes.CHANGE_PASSWORD_ERROR,
    payload: {
        change_password_error
    }
});

const setForgotPasswordLoading = (forgot_password_loading) => {
    return {
        type: LoginReduxTypes.FORGOT_PASSWORD_LOADING, 
        payload: {
            forgot_password_loading
        }
    }
};

const setForgotPasswordSuccess = (result) => ({
    type: LoginReduxTypes.FORGOT_PASSWORD_SUCCESS,
    payload: {
        result
    }
});

const setForgotPasswordError = (forgot_password_error) => ({
    type: LoginReduxTypes.FORGOT_PASSWORD_ERROR,
    payload: {
        forgot_password_error
    }
});














//Test
const setUserDetailsSuccess = (user) => ({
    type: LoginReduxTypes.GET_USER_DETAILS,
    payload: {
      ...user
    }
});

const setUserDetailsLoading = (loading) => {
    return {
        type: LoginReduxTypes.USER_DETAILS_LOADING, 
        payload: {
            loading
        }
    }
};