//

import {doPlayAllAvailableSound} from '../actions/play-audio.js';
import {mDemoSchedules} from '../demo/schedules.js';
import {Scheduler} from '../scheduler/scheduler.js';

const scheduler = new Scheduler(mDemoSchedules);
scheduler.verbose = true;

export const doStartBackgroundService = () => {
	scheduler.doStartSchedules();
	doPlayAllAvailableSound().then(() => {
		console.log('[%s] Tested all available sounds.', new Date().toString());
	});
	console.log('[%s] Started background service.', new Date().toString());
};