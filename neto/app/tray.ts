// Minimize to system tray.
// @see https://github.com/nwjs/nw.js/wiki/Minimize-to-tray

import {_conf} from './configures.js';
import {WindowStatus} from './status.js';

const gui = require('nw.gui');

// Reference to window and tray
const win: any = gui.Window.get();
let tray: any;
let status = new WindowStatus();

const togglePrimaryWindow = (action?: boolean) => {
	// Will hide the window, if action is false.
	if (action === undefined ? status.isHidden() : action) {
		win.show();
		status.setStatus(WindowStatus.STATUS_NORMAL);
	} else {
		win.hide();
		status.setStatus(WindowStatus.STATUS_HIDDEN);
	}
};

const doExitApp = () => {
	// Exiting the application only when the tray is null.
	if (tray) {
		tray.remove();
		tray = null;
	}
	win.close();
};

const newTrayMenu = () => {
	const menu = new nw.Menu();
	[
		// Check the current status, and show window when needed.
		{label: 'App Home', click: () => togglePrimaryWindow()},
		{type: 'separator'},
		{label: 'Upgrade', click: () => alert('Hi there, the application is up-to-date!')},
		{label: 'About', click: () => alert('Hello, from Neto Desktop')},
		{type: 'separator'},
		{label: 'Exit', click: doExitApp},
	].map(options => menu.append(new nw.MenuItem(options)));
	// {type: 'checkbox', label: 'box1'}
	return menu;
};

const newTray = () => {
	tray = new gui.Tray({icon: 'assets/images/icon.png'});
	tray.menu = newTrayMenu();
	return tray;
};

if (_conf.useTrayOnly()) {
	const tray = newTray();
	console.log('Setting up a permanent tray, to toggle(hide and show) the primary window later!');
	tray.on('click', function () {
		console.log('Clicked tray, will toggle the primary window:', status.isHidden());
		togglePrimaryWindow();
	});
}

// @see http://docs.nwjs.io/en/latest/References/Window/#wincloseforce
win.on('close', () => {
	// Pretend to be closed already
	togglePrimaryWindow(false);
	if (tray) {return;}
	// Exiting the application only when the tray is null.
	console.log('Closing app...');
	win.close(true);
});

// Get the minimize event
if (_conf.isDebuggingMode()) {win.showDevTools();}
win.on('minimize', function () {
	console.log('On minimized: hide window.', win);
	togglePrimaryWindow(false);
	if (!_conf.useTrayOnly()) {
		console.log('Setting up a temporary tray, to show primary window later!');
		// In the normal mode, tray are removed automatically.
		tray = newTray();
		// Show window and remove tray when clicked
		tray.on('click', function () {
			togglePrimaryWindow(true);
			tray.remove();
			tray = null;
		});
	}
});

// The tray may change.
export const getAppTray = () => tray;