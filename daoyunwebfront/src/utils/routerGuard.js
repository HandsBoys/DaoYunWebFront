import { getToken } from "@/utils/auth";

export function routerToLogin() {
    var x = getToken();
    if (x == null) {
        return true;
    }
    return false;
}
