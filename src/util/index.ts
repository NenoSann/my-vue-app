import DOMPurify from 'dompurify';
const uriRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)(?:\/\S*)?/g;
export function formatDate(date: Date | string): string {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export function replaceWebLinks(inputString: string) {
    const replacedString = inputString.replace(uriRegex, (match, p1) => {
        const url = match.startsWith('https') ? match : `https://${match}`;
        return `<a href="${url}" class="external-url">${match}</a>`;
    });
    return DOMPurify.sanitize(replacedString);
}