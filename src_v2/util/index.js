export const str2Hump = (str) => {
    var r = /-(\w)/g;
    return str.replace(r, function($0, $1) {
        return $1.toUpperCase();
    });
}