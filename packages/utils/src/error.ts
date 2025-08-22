/**
 * 将字符串转为 Base64 格式的唯一 ID
 * 1.encodeURIComponent() 对原始字符串进行 URI 编码，
 *  把非 ASCII 字符（比如中文、特殊符号等）转换为 %xx 形式的安全格式
 *  防止后续处理出错（特别是包含换行、空格、emoji 的字符串）
 *
 * 2.btoa 的作用是将一个字符串（必须是 Latin1/ASCII 编码）转换为 Base64 编码。
 *
 *  所以一般要 先用 encodeURIComponent 把字符串转为纯 ASCII 字符串，才能安全使用 btoa。
 */

export function getUniqueHash(str: string) {
    return btoa(encodeURIComponent(str))
}
