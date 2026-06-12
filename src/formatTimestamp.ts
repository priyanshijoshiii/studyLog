/**
 * Formats a Unix timestamp into a human-readable time string
 * based on the specified language.
 *
 * Returns time only if the timestamp is from today, or date and time
 * if it is from a previous day. Russian uses 24-hour format,
 * English uses 12-hour format with AM/PM.
 *
 * Returns an empty string if the input is invalid.
 *
 * @param ts - Unix timestamp in milliseconds
 * @param lang - Language code: 'en' for English (12h), 'ru' for Russian (24h)
 * @returns Formatted time string, or empty string for invalid input
 */
const formatters = {
    enTime: new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute:'2-digit', hour12: true}),
    ruTime: new Intl.DateTimeFormat('ru-RU', {hour:'2-digit', minute: '2-digit'}),
    enDate: new Intl.DateTimeFormat('en-US', {month: 'short', day:'numeric'}),
    ruDate: new Intl.DateTimeFormat('ru-RU', {month: 'short', day:'numeric'}),
}

export function formatTimestamp(ts: number, lang: 'ru' | 'en' ):string{
    
    //defensive runtime validation in case the function i called from untyped javascript or external use
    const safeLang: 'ru' | 'en' = (lang === 'ru' || lang === 'en') ? lang : 'en'
    
    //step1 : validate input
    if(!Number.isFinite(ts)){
        return '' // or maybe invailid input
    }

    const date = new Date(ts);
    if(isNaN(date.getTime())){
        return ''
    }

    const now = new Date()

    //step2: check if same calender date(not hours elapsed)
    try{
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

            // step3: format time only
            const timeStr = safeLang === 'ru' 
            ? formatters.ruTime.format(date)
            : formatters.enTime.format(date)

            //step4: if today return just time
            if(isToday) return timeStr;

            //step5: if not today, return date+ time
            const dateStr = safeLang === 'ru'
            ? formatters.ruDate.format(date)
            : formatters.enDate.format(date)


            return dateStr + ' · ' + timeStr        
    } catch{
        return ''
    }
}