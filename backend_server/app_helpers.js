const chrono = require("chrono-node");

function isValidTimezone(tz) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch (e) {
        return false;
    }
}

function parseDateInput(input) {
    const parsed = chrono.parseDate(input);
    if (!parsed) throw new Error(`Invalid date input: ${input}`);
    return parsed.toISOString();
}

module.exports = {
    isValidTimezone,
    parseDateInput,
};
