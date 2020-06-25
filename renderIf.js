export default function renderIf(condition, contentTrue, contentFalse) {
    if (condition) {
        return contentTrue;
    } else {
        return contentFalse;
    }
}