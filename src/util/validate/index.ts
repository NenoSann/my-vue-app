import isEmail from "validator/es/lib/isEmail";

function emailValidate(email: string): boolean {
    if (email) {
        return isEmail(email);
    }
    return false;
}

export { emailValidate };
