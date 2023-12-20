// ConsoleColors
export enum CC {
	stop = '\x1b[0m',
	bold = '\x1b[1m',
	italic = '\x1b[3m',
	underline = '\x1b[4m',
	highlight = '\x1b[7m',
	hidden = '\x1b[8m',
	strikethrough = '\x1b[9m',
	doubleUnderline = '\x1b[21m',
	black = '\x1b[30m',
	gray = '\x1b[37m',
	red = '\x1b[31m',
	green = '\x1b[32m',
	yellow = '\x1b[33m',
	blue = '\x1b[34m',
	magenta = '\x1b[35m',
	cyan = '\x1b[36m',
	white = '\x1b[38m',
	blackbg = '\x1b[40m',
	redbg = '\x1b[41m',
	greenbg = '\x1b[42m',
	yellowbg = '\x1b[43m',
	bluebg = '\x1b[44m',
	magentabg = '\x1b[45m',
	cyanbg = '\x1b[46m',
	whitebg = '\x1b[47m',
}
// DiscordColors
export enum DC {
	black = 2303786,
	gray = 9807270,
	red = 15548997,
	green = 5763719,
	yellow = 16776960,
	blue = 3447003,
	magenta = 15418782,
	cyan = 1752220,
	white = 16777215,
}

export const textStyleReplaceMap = new Map([
	['&b', CC.bold],
	['&i', CC.italic],
	['&u', CC.underline],
	['&h', CC.highlight],
	['&s', CC.strikethrough],
	['&du', CC.doubleUnderline],
]);

export const textColorReplaceMap = new Map([
	['#black', CC.black],
	['#gray', CC.gray],
	['#red', CC.red],
	['#green', CC.green],
	['#yellow', CC.yellow],
	['#blue', CC.blue],
	['#magenta', CC.magenta],
	['#cyan', CC.cyan],
	['#white', CC.white],
]);

export const textBackgroundReplaceMap = new Map([
	['£black', CC.blackbg],
	['£red', CC.redbg],
	['£green', CC.greenbg],
	['£yellow', CC.yellowbg],
	['£blue', CC.bluebg],
	['£magenta', CC.magentabg],
	['£cyan', CC.cyanbg],
	['£white', CC.whitebg],
]);
