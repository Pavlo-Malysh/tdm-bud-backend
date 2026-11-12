export async function notifyTelegram(lead) {
    const { TG_TOKEN, TG_CHAT_ID } = process.env;
    if (!TG_TOKEN || !TG_CHAT_ID) return;

    const text =
        `🏠 Нова заявка TDM BUD\n\n` +
        `👤 Імʼя: ${lead.username}\n` +
        `📞 Телефон: ${lead.phone}\n`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
        });
        if (!res.ok) console.error('Telegram error:', await res.text());
    } catch (err) {
        console.error('Telegram request failed:', err.message);
    }
}
