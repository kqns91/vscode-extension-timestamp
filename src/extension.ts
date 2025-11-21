import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Unix Timestamp Hover extension is now active');

    const hoverProvider = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position, /\d+/);
            if (!range) {
                return;
            }

            const word = document.getText(range);
            const timestamp = parseInt(word, 10);

            if (isNaN(timestamp)) {
                return;
            }

            // Simple heuristic to detect Unix timestamp
            // Seconds: 10 digits
            // Milliseconds: 13 digits
            // Microseconds: 16 digits
            // Nanoseconds: 19 digits
            const isSeconds = /^\d{10}$/.test(word);
            const isMilliseconds = /^\d{13}$/.test(word);
            const isMicroseconds = /^\d{16}$/.test(word);
            const isNanoseconds = /^\d{19}$/.test(word);

            if (!isSeconds && !isMilliseconds && !isMicroseconds && !isNanoseconds) {
                return;
            }

            // Convert to milliseconds for Date object
            let dateValue = timestamp;
            if (isSeconds) {
                dateValue = timestamp * 1000;
            } else if (isMicroseconds) {
                dateValue = Math.floor(timestamp / 1000);
            } else if (isNanoseconds) {
                dateValue = Math.floor(timestamp / 1000000);
            }

            // Sanity check: Year between 1970 and 2100
            const date = new Date(dateValue);
            const year = date.getUTCFullYear();
            if (year < 1970 || year > 2100) {
                return;
            }

            const config = vscode.workspace.getConfiguration('timestampHover');
            const timezone = config.get<string>('timezone', 'Asia/Tokyo');
            const dateFormat = config.get<string>('format', 'YYYY/MM/DD HH:mm:ss');

            try {
                const formattedDate = formatDate(date, timezone, dateFormat);
                const markdown = new vscode.MarkdownString(formattedDate);
                return new vscode.Hover(markdown);
            } catch (error) {
                console.error('Error formatting date:', error);
                return;
            }
        }
    });

    context.subscriptions.push(hoverProvider);
}

function formatDate(date: Date, timezone: string, format: string): string {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(date);

    const mapping: { [key: string]: string } = {};
    parts.forEach(p => {
        if (p.type !== 'literal') {
            mapping[p.type] = p.value;
        }
    });

    const ms = date.getMilliseconds().toString().padStart(3, '0');

    return format
        .replace('YYYY', mapping['year'])
        .replace('MM', mapping['month'])
        .replace('DD', mapping['day'])
        .replace('HH', mapping['hour'])
        .replace('mm', mapping['minute'])
        .replace('ss', mapping['second'])
        .replace('SSS', ms);
}

export function deactivate() { }
