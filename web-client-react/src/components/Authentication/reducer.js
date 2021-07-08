const reducer = (state, action) => {
    const { payload } = action

    switch (action.type) {
        case "CHANGE_PASSWORD":
            return {
                ...state,
                passwordChangeSuccessful: payload.error ? false : true,
                passwordError: payload.error ? true : false,
                passwordErrorMsg: payload.error
            }

        case "LOGOUT":
            return {
                ...state
            }

        case "RESET_PASSWORD":
            return {
                ...state,
                loading: false,
                passwordChangeSuccessful: false,
                passwordError: false,
                passwordErrorMsg: ""
            }

        case "SET_LOGIN_ERROR":
            return {
                ...state,
                loginError: true,
                loginErrorMsg: payload.msg
            }

        case "SET_REGISTER_ERROR":
            return {
                ...state,
                registerError: true,
                registerErrorMsg: action.errorMsg
            }

        case "SET_USER_DATA":
            let user = {}
            let verify = false

            if (!payload.user.emailVerified) {
                verify = true
            }

            user = {
                // bio: payload.user.bio,
                createdAt: payload.user.createdAt,
                email: payload.user.email,
                emailVerified: payload.user.emailVerified,
                name: payload.user.name,
                id: payload.user.id,
                img: payload.user.img,
                username: payload.user.username,
                verificationCode: payload.user.verificationCode
            }

            return {
                ...state,
                authenticated: true,
                bearer: payload.token,
                data: user,
                loginError: false,
                loginErrorMsg: "",
                registerError: false,
                registerErrorMsg: "",
                verify
            }

        case "SET_VERIFICATION_ERROR":
            return {
                ...state,
                verifyError: true,
                verifyErrorMsg: payload.msg
            }

        case "VERIFY_EMAIL":
            return {
                ...state,
                data: {
                    ...state.data,
                    emailVerified: true
                },
                verifyError: false,
                verrifyErrorMsg: ""
            }
        default:
            throw new Error()
    }
}

export default reducer
