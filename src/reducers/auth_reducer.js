import LoginReduxTypes from '../constants/redux_login_types';
import DealReduxTypes from '../constants/redux_deal_types';

const initialState = {
    loading: false,
    user: null,
    login_loading: false,
    login_error: null,
    login_success: false,
    register_loading: false,
    register_success: false,
    register_error: null,
    selfie_upload_loading: false,
    selfie_upload_success: false,
    selfie_upload_error: null,
    proof_upload_loading: false,
    proof_upload_success: false,
    proof_upload_error: null,
    update_loading: false,
    update_success: false,
    update_error: null,
    email_update_loading: false,
    email_update_success: false,
    email_update_error: null,
    email_verify_loading: false,
    email_verify_success: false,
    email_verify_error: null,

    pending_check_loading: false,
    pending_check_error: false,
    pending_check_status: null,
    
    change_password_loading: false,
    change_password_error: null,
    change_password_success: null,
    
    forgot_password_loading: false,
    forgot_password_error: null,
    forgot_password_success: null,
    //Deals:
    home_deals: [],
    top_tips: [],
    favourite_deals: [],
    favourite_deals_loading: false,
    favourite_deals_success: false,
    favourite_deals_error: null,
    home_deals_loading: false,
    home_deals_success: false,
    home_deals_error: null,
    like_deal_error: null,
    unlike_deal_error: null,
    active_deal: null,
    check_availability_loading: false,
    check_availability_success: null,
    check_availability_error: null,
    redeem_deal_loading: false,
    redeem_deal_success: null,
    redeem_deal_error: null,
    current_deal_qr_code: null,
    current_deal_public_pin: null,
    current_deal_private_pin: null,
    current_deal_milliseconds_till_next: null,
    current_category: null,

    category_deals: [],
    category_deals_complete: false,
    category_deals_loading: false,
    category_deals_success: false,
    category_deals_error: null,
    
    search_deals: [],
    search_deals_complete: false,
    search_deals_loading: false,
    search_deals_success: false,
    search_deals_error: null,

    //Notifications
    user_notifications: [],
    get_user_notifications_loading: false,
    get_user_notifications_success: false,
    get_user_notifications_error: null,

    //Settings
    is_push_notifications_enabled: true
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LoginReduxTypes.SET_NOTIFICATIONS_ENABLED:
        return {
          ...state,
          is_push_notifications_enabled: action.payload.enabled
        };

      case LoginReduxTypes.USER_LOGIN_LOADING:
        return {
          ...state,
          login_loading: action.payload.login_loading
        };
      case LoginReduxTypes.USER_LOGIN_ERROR:
        return {
          ...state,
          login_loading: false,
          login_error: action.payload.login_error,
          user: null
        };
      case LoginReduxTypes.REGISTER_SUCCESS:
        return {
          ...state,
          register_success: true,
          login_success: true,
          register_loading: false,
          register_error: null,
          user: action.payload
        };
      case LoginReduxTypes.REGISTER_LOADING:
        return {
          ...state,
          register_loading: action.payload.register_loading
        };
      case LoginReduxTypes.REGISTER_ERROR:
        return {
          ...state,
          register_loading: false,
          register_error: action.payload.register_error,
          user: null
        };
      case LoginReduxTypes.LOGIN_USER_SUCCESS:
        return {
          ...state,
          login_loading: false,
          login_error: null,
          login_success: true,
          user: action.payload
        };
      case LoginReduxTypes.SELFIE_UPLOAD_SUCCESS:
          return {
            ...state,
            user: action.payload,
            selfie_upload_loading: false,
            selfie_upload_success: true,
            selfie_upload_error: null,
          };
      case LoginReduxTypes.SELFIE_UPLOAD_LOADING:
          return {
            ...state,
            selfie_upload_loading: action.payload.selfie_upload_loading
          };
      case LoginReduxTypes.SELFIE_UPLOAD_ERROR:
          return {
            ...state,
            selfie_upload_loading: false,
            selfie_upload_error: action.payload.selfie_upload_error,
            selfie_upload_success: false
          };
      case LoginReduxTypes.PROOF_UPLOAD_SUCCESS:
          return {
            ...state,
            user: action.payload,
            proof_upload_loading: false,
            proof_upload_success: true,
            proof_upload_error: null,
          };
      case LoginReduxTypes.PROOF_UPLOAD_LOADING:
          return {
            ...state,
            proof_upload_loading: action.payload.proof_upload_loading
          };
      case LoginReduxTypes.PROOF_UPLOAD_ERROR:
          return {
            ...state,
            proof_upload_loading: false,
            proof_upload_error: action.payload.proof_upload_error,
            proof_upload_success: false
          };
      case LoginReduxTypes.USER_UPDATE_SUCCESS:
          return {
            ...state,
            user: action.payload,
            update_loading: false,
            update_success: true,
            update_error: null,
          };
      case LoginReduxTypes.USER_UPDATE_LOADING:
          return {
            ...state,
            update_loading: action.payload.update_loading
          };
      case LoginReduxTypes.USER_UPDATE_ERROR:
          return {
            ...state,
            update_loading: false,
            update_error: action.payload.update_error,
            update_success: false
          };
      case LoginReduxTypes.CLEAR_UPDATE_SUCCESS:
          return {
            ...state,
            update_loading: false,
            update_error: null,
            update_success: false
          };

      case LoginReduxTypes.EMAIL_UPDATE_SUCCESS:
          return {
            ...state,
            user: action.payload,
            email_update_loading: false,
            email_update_success: true,
            email_update_error: null,
          };
      case LoginReduxTypes.EMAIL_UPDATE_LOADING:
          return {
            ...state,
            email_update_loading: action.payload.email_update_loading
          };
      case LoginReduxTypes.EMAIL_UPDATE_ERROR:
          return {
            ...state,
            email_update_loading: false,
            email_update_error: action.payload.email_update_error,
            email_update_success: false
          };
      case LoginReduxTypes.CLEAR_EMAIL_UPDATE_SUCCESS:
          return {
            ...state,
            email_update_loading: false,
            email_update_error: null,
            email_update_success: false
          };
      case LoginReduxTypes.EMAIL_VERIFY_SUCCESS:
          return {
            ...state,
            user: action.payload,
            email_verify_loading: false,
            email_verify_success: true,
            email_verify_error: null,
          };
      case LoginReduxTypes.EMAIL_VERIFY_LOADING:
          return {
            ...state,
            email_verify_loading: action.payload.email_verify_loading
          };
      case LoginReduxTypes.EMAIL_VERIFY_ERROR:
          return {
            ...state,
            email_verify_loading: false,
            email_verify_error: action.payload.email_verify_error,
            email_verify_success: false
          };
      case LoginReduxTypes.PENDING_CHECK_SUCCESS:
        if(action.user == null){
          return {
            ...state,
            pending_check_loading: false,
            pending_check_status: action.status,
            pending_check_error: null,
          };
        }else{
          return {
            ...state,
            user: action.user,
            pending_check_loading: false,
            pending_check_status: action.status,
            pending_check_error: null,
          };
        }
      case LoginReduxTypes.PENDING_CHECK_LOADING:
          return {
            ...state,
            pending_check_loading: action.payload.pending_check_loading
          };
      case LoginReduxTypes.PENDING_CHECK_ERROR:
          return {
            ...state,
            pending_check_loading: false,
            pending_check_error: action.payload.pending_check_error,
            pending_check_status: false
          };
      case LoginReduxTypes.RESET_AUTH_STORE:
          return {
            ...state,
            loading: false,
            user: null,
            login_loading: false,
            login_error: null,
            login_success: false,
            register_loading: false,
            register_success: false,
            register_error: null,
            selfie_upload_loading: false,
            selfie_upload_success: false,
            selfie_upload_error: null,
            proof_upload_loading: false,
            proof_upload_success: false,
            proof_upload_error: null,
            update_loading: false,
            update_success: false,
            update_error: null,
            email_update_loading: false,
            email_update_success: false,
            email_update_error: null,
            email_verify_loading: false,
            email_verify_success: false,
            email_verify_error: null,

            pending_check_loading: false,
            pending_check_error: false,
            pending_check_status: null,
            
            change_password_loading: false,
            change_password_error: null,
            change_password_success: null,
            //Deals:
            home_deals: [],
            top_tips: [],
            favourite_deals: [],
            favourite_deals_loading: false,
            favourite_deals_success: false,
            favourite_deals_error: null,
            home_deals_loading: false,
            home_deals_success: false,
            home_deals_error: null,
            like_deal_error: null,
            unlike_deal_error: null,
            active_deal: null,
            check_availability_loading: false,
            check_availability_success: null,
            check_availability_error: null,
            redeem_deal_loading: false,
            redeem_deal_success: null,
            redeem_deal_error: null,
            current_deal_qr_code: null,
            current_deal_public_pin: null,
            current_deal_private_pin: null,
            current_deal_milliseconds_till_next: null,
            current_category: null,

            category_deals: [],
            category_deals_complete: false,
            category_deals_loading: false,
            category_deals_success: false,
            category_deals_error: null,
            
            search_deals: [],
            search_deals_complete: false,
            search_deals_loading: false,
            search_deals_success: false,
            search_deals_error: null,

            //Notifications
            user_notifications: [],
            get_user_notifications_loading: false,
            get_user_notifications_success: false,
            get_user_notifications_error: null,

            //Settings
            is_push_notifications_enabled: true
          };

      //Deals:
      case DealReduxTypes.FAVOURITE_DEALS_LOAD_LOADING:
          return {
              ...state,
              favourite_deals_loading: action.payload.favourite_deals_loading
          };
      case DealReduxTypes.FAVOURITE_DEALS_LOAD_SUCCESS:
          return {
              ...state,
              favourite_deals: action.payload.deals,
              favourite_deals_loading: false,
              favourite_deals_success: true,
              favourite_deals_error: null,
          };
      case DealReduxTypes.FAVOURITE_DEALS_LOAD_ERROR:
          return {
              ...state,
              favourite_deals_loading: false,
              favourite_deals_success: false,
              favourite_deals_error: action.payload.favourite_deals_error,
          };
      case DealReduxTypes.CHECK_AVAILABILITY_LOAD_LOADING:
          return {
              ...state,
              check_availability_loading: action.payload.check_availability_loading
          };
      case DealReduxTypes.CHECK_AVAILABILITY_LOAD_SUCCESS:
          if(action.payload.message == "usage_limit_reached"){
            return {
              ...state,
              check_availability_success: action.payload.message,
              current_deal_milliseconds_till_next: action.payload.data['millisecondsTillNextUsage'],
              current_deal_private_pin: null,
              current_deal_public_pin: null,
              current_deal_qr_code: null,
              check_availability_loading: false,
              check_availability_error: null,
            };
          }else if(action.payload.message == "deal_unavailable"){
            return {
              ...state,
              check_availability_success: action.payload.message,
              current_deal_milliseconds_till_next: null,
              current_deal_private_pin: null,
              current_deal_public_pin: null,
              current_deal_qr_code: null,
              check_availability_loading: false,
              check_availability_error: null,
              favourite_deals: state.favourite_deals.filter(i =>  i['id'] != action.payload.data['deal_id']),
              home_deals: state.home_deals.filter(i =>  i['id'] != action.payload.data['deal_id']),
            };
          }else if(action.payload.message == "deal_available"){
            return {
              ...state,
              check_availability_success: action.payload.message,
              current_deal_milliseconds_till_next: null,
              current_deal_private_pin: action.payload.data['private_pin'],
              current_deal_public_pin: action.payload.data['public_pin'],
              current_deal_qr_code: action.payload.data['qr_code'],
              check_availability_loading: false,
              check_availability_error: null,
            };
          }else if(action.payload.message == null){
            return {
              ...state,
              check_availability_success: null,
              check_availability_loading: false,
              check_availability_error: null,
            };
          }else{
            return {
              ...state,
              check_availability_success: action.payload.message,
              current_deal_private_pin: null,
              current_deal_public_pin: null,
              current_deal_qr_code: null,
              check_availability_loading: false,
              check_availability_error: null,
            };
          }
          
      case DealReduxTypes.CHECK_AVAILABILITY_LOAD_ERROR:
          return {
              ...state,
              check_availability_loading: false,
              check_availability_success: null,
              check_availability_error: action.payload.check_availability_error,
          };
      case DealReduxTypes.REDEEM_DEAL_LOAD_LOADING:
          return {
              ...state,
              redeem_deal_loading: action.payload.redeem_deal_loading
          };
      case DealReduxTypes.REDEEM_DEAL_LOAD_SUCCESS:
          if(action.payload.message == "usage_limit_reached"){
            return {
              ...state,
              redeem_deal_success: action.payload.message,
              current_deal_milliseconds_till_next: action.payload.data['millisecondsTillNextUsage'],
              current_deal_private_pin: null,
              current_deal_public_pin: null,
              current_deal_qr_code: null,
              redeem_deal_loading: false,
              redeem_deal_error: null,
            };
          }else if(action.payload.message == "deal_unavailable"){
            return {
              ...state,
              redeem_deal_success: action.payload.message,
              current_deal_milliseconds_till_next: null,
              current_deal_private_pin: null,
              current_deal_public_pin: null,
              current_deal_qr_code: null,
              redeem_deal_loading: false,
              redeem_deal_error: null,
              favourite_deals: state.favourite_deals.filter(i =>  i['id'] != action.payload.data['deal_id']),
              home_deals: state.home_deals.filter(i =>  i['id'] != action.payload.data['deal_id']),
            };
          }else if(action.payload.message == "deal_redeem_success"){
            return {
              ...state,
              redeem_deal_success: action.payload.message,
              current_deal_milliseconds_till_next: action.payload.data['millisecondsTillNextUsage'],
              current_deal_private_pin: null,
              current_deal_public_pin: null,
              current_deal_qr_code: null,
              redeem_deal_loading: false,
              redeem_deal_error: null,
            };
          }else if(action.payload.message == null){
            return {
              ...state,
              redeem_deal_success: null,
              redeem_deal_loading: false,
              redeem_deal_error: null,
            };
          }
          
      case DealReduxTypes.REDEEM_DEAL_LOAD_ERROR:
          return {
              ...state,
              redeem_deal_loading: false,
              redeem_deal_success: null,
              redeem_deal_error: action.payload.redeem_deal_error,
          };
      case DealReduxTypes.CATEGORY_DEALS_LOAD_LOADING:
          return {
              ...state,
              category_deals_loading: action.payload.category_deals_loading
          };
      case DealReduxTypes.CATEGORY_DEALS_LOAD_SUCCESS:
        if(action.payload.message == null){
          return {
            ...state,
            category_deals: action.payload.data == null ? []:action.payload.data,
            category_deals_success: action.payload.data != null,
            category_deals_loading: false,
            category_deals_error: null,
          };
        }else{
          return {
            ...state,
            category_deals: action.payload.data == null ? []:action.payload.data,
            category_deals_complete: action.payload.message == 'complete',
            category_deals_success: action.payload.data != null,
            category_deals_loading: false,
            category_deals_error: null,
          };
        }
          
      case DealReduxTypes.CATEGORY_DEALS_LOAD_ERROR:
          return {
              ...state,
              category_deals_loading: false,
              category_deals_success: false,
              category_deals_error: action.payload.category_deals_error,
          };
      case DealReduxTypes.SEARCH_DEALS_LOAD_LOADING:
          return {
              ...state,
              search_deals_loading: action.payload.search_deals_loading
          };
      case DealReduxTypes.SEARCH_DEALS_LOAD_SUCCESS:
        if(action.payload.message == null){
          return {
            ...state,
            search_deals: action.payload.data == null ? []:action.payload.data,
            search_deals_success: action.payload.data != null,
            search_deals_loading: false,
            search_deals_error: null,
          };
        }else{
          return {
            ...state,
            search_deals: action.payload.data == null ? []:action.payload.data,
            search_deals_complete: action.payload.message == 'complete',
            search_deals_success: action.payload.data != null,
            search_deals_loading: false,
            search_deals_error: null,
          };
        }
      case DealReduxTypes.SEARCH_DEALS_LOAD_ERROR:
          return {
              ...state,
              search_deals_loading: false,
              search_deals_success: false,
              search_deals_error: action.payload.search_deals_error,
          };
      case DealReduxTypes.HOME_DEALS_LOAD_LOADING:
          return {
              ...state,
              home_deals_loading: action.payload.home_deals_loading
          };
      case DealReduxTypes.HOME_DEALS_LOAD_SUCCESS:
          return {
              ...state,
              home_deals: action.payload.deals,
              top_tips: action.payload.top_tips,
              home_deals_loading: false,
              home_deals_success: true,
              home_deals_error: null,
          };
      case DealReduxTypes.HOME_DEALS_LOAD_ERROR:
          return {
              ...state,
              home_deals_loading: false,
              home_deals_success: false,
              home_deals_error: action.payload.home_deals_error,
          };
      case DealReduxTypes.ADD_LIKE_DEAL:
          return {
              ...state,
              favourite_deals: [action.payload.deal, ...state.favourite_deals]
          };
      case DealReduxTypes.LIKE_DEAL_ERROR:
          return {
              ...state,
              favourite_deals: state.favourite_deals.filter(i =>  i['id'] != action.payload.dealId),
              like_deal_error: action.payload.like_deal_error
          };
      case DealReduxTypes.REMOVE_LIKE_DEAL:
          return {
              ...state,
              favourite_deals: state.favourite_deals.filter(i =>  i['id'] != action.payload.dealId)
          };
      case DealReduxTypes.UNLIKE_DEAL_ERROR:
          return {
              ...state,
              favourite_deals: [action.payload.deal, ...state.favourite_deals],
              unlike_deal_error: action.payload.unlike_deal_error
          };
      case DealReduxTypes.SET_ACTIVE_DEAL:
          return {
              ...state,
              active_deal: action.payload.active_deal
          };

      case DealReduxTypes.GET_USER_NOTIFICATIONS_LOADING:
          return {
              ...state,
              get_user_notifications_loading: action.payload.get_user_notifications_loading
          };
      case DealReduxTypes.GET_USER_NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          user_notifications: action.payload.data.concat(state.user_notifications),
          get_user_notifications_success: true,
          get_user_notifications_loading: false,
          get_user_notifications_error: null,
        };
      case DealReduxTypes.GET_USER_NOTIFICATIONS_ERROR:
          return {
              ...state,
              get_user_notifications_loading: false,
              get_user_notifications_success: false,
              get_user_notifications_error: action.payload.get_user_notifications_error,
          };
    case DealReduxTypes.REMOVE_USER_NOTIFICATION:
      var newList = state.user_notifications.filter((i) => {return i['id'] !== action.payload.id});
          return {
              ...state,
              user_notifications: newList,
          };


      case LoginReduxTypes.CHANGE_PASSWORD_SUCCESS:
          return {
            ...state,
            change_password_loading: false,
            change_password_success: action.payload.result,
            change_password_error: null,
          };
      case LoginReduxTypes.CHANGE_PASSWORD_LOADING:
          return {
            ...state,
            change_password_loading: action.payload.change_password_loading
          };
      case LoginReduxTypes.CHANGE_PASSWORD_ERROR:
          return {
            ...state,
            change_password_loading: false,
            change_password_error: action.payload.change_password_error,
            change_password_success: null
          };
      
      case LoginReduxTypes.FORGOT_PASSWORD_SUCCESS:
          return {
            ...state,
            forgot_password_loading: false,
            forgot_password_success: action.payload.result,
            forgot_password_error: null,
          };
      case LoginReduxTypes.FORGOT_PASSWORD_LOADING:
          return {
            ...state,
            forgot_password_loading: action.payload.forgot_password_loading
          };
      case LoginReduxTypes.FORGOT_PASSWORD_ERROR:
          return {
            ...state,
            forgot_password_loading: false,
            forgot_password_error: action.payload.forgot_password_error,
            forgot_password_success: null
          };

      //Test
      case LoginReduxTypes.GET_USER_DETAILS:
        return {
          ...state,
          loading: false,
          error: null,
          user: action.payload
        };
      case LoginReduxTypes.USER_DETAILS_LOADING:
        return {
          ...state,
          loading: action.payload.loading
        };
      //

      default:
        return state;
    }
}
export default authReducer;