var opening_hours = require('./opening_hours.js');

var test = new opening_hours_test();

test.addTest('Time intervals', [
		'10:00-12:00',
		'10:00-11:00,11:00-12:00',
		'10:00-11:00;11:00-12:00',
		'10:00-14:00;12:00-14:00 off',
		'10:00-12:00;10:30-11:30',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 12:00' ],
		[ '2012.10.02 10:00', '2012.10.02 12:00' ],
		[ '2012.10.03 10:00', '2012.10.03 12:00' ],
		[ '2012.10.04 10:00', '2012.10.04 12:00' ],
		[ '2012.10.05 10:00', '2012.10.05 12:00' ],
		[ '2012.10.06 10:00', '2012.10.06 12:00' ],
		[ '2012.10.07 10:00', '2012.10.07 12:00' ],
	], 1000 * 60 * 60 * 2 * 7, true);

test.addTest('Time ranges spanning midnight', [
		'22:00-02:00',
		'22:00-26:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 02:00' ],
		[ '2012.10.01 22:00', '2012.10.02 02:00' ],
		[ '2012.10.02 22:00', '2012.10.03 02:00' ],
		[ '2012.10.03 22:00', '2012.10.04 02:00' ],
		[ '2012.10.04 22:00', '2012.10.05 02:00' ],
		[ '2012.10.05 22:00', '2012.10.06 02:00' ],
		[ '2012.10.06 22:00', '2012.10.07 02:00' ],
		[ '2012.10.07 22:00', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * 4 * 7, true);

test.addTest('Weekdays', [
		'Mo,Th,Sa,Su 10:00-12:00',
		'Mo,Th,Sa-Su 10:00-12:00',
		'Th,Sa-Mo 10:00-12:00',
		'10:00-12:00; Tu-We 00:00-24:00 off; Fr 00:00-24:00 off',
		'10:00-12:00; Tu-We off; Fr off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 12:00' ],
		[ '2012.10.04 10:00', '2012.10.04 12:00' ],
		[ '2012.10.06 10:00', '2012.10.06 12:00' ],
		[ '2012.10.07 10:00', '2012.10.07 12:00' ],
	], 1000 * 60 * 60 * 2 * 4, true);

test.addTest('Omitted time', [
		'Mo,We',
		'Mo-We; Tu off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 0:00', '2012.10.02 0:00' ],
		[ '2012.10.03 0:00', '2012.10.04 0:00' ],
	], 1000 * 60 * 60 * 24 * 2, true);

test.addTest('Time ranges spanning midnight w/weekdays', [
		'We 22:00-02:00',
		'We 22:00-26:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.03 22:00', '2012.10.04 02:00' ],
	], 1000 * 60 * 60 * 4, true);

test.addTest('Full range', [
		'00:00-24:00',
		'Mo-Su 00:00-24:00',
		'Tu-Mo 00:00-24:00',
		'We-Tu 00:00-24:00',
		'Th-We 00:00-24:00',
		'Fr-Th 00:00-24:00',
		'Sa-Fr 00:00-24:00',
		'Su-Sa 00:00-24:00',
		'24/7',
		'Jan-Dec', // week stable actually, but check for that needs extra logic
		'Feb-Jan', // week stable actually, but check for that needs extra logic
		'Jan 01-Dec 31', // week stable actually, but check for that needs extra logic
		'week 1-53', // week stable actually, but check for that needs extra logic
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 0:00', '2012.10.08 0:00' ],
	], 1000 * 60 * 60 * 24 * 7, undefined);

test.addTest('24/7 as time interval alias', [
		'Mo,We 24/7',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 0:00', '2012.10.02 0:00' ],
		[ '2012.10.03 0:00', '2012.10.04 0:00' ],
	], 1000 * 60 * 60 * 24 * 2, true);

test.addTest('Constrained weekdays', [
		'We[4,5] 10:00-12:00',
		'We[4-5] 10:00-12:00',
		'We[4],We[5] 10:00-12:00',
		'We[4] 10:00-12:00; We[-1] 10:00-12:00',
		'We[-1,-2] 10:00-12:00',
	], '2012.10.01 0:00', '2012.11.01 0:00', [
		[ '2012.10.24 10:00', '2012.10.24 12:00' ],
		[ '2012.10.31 10:00', '2012.10.31 12:00' ],
	], 1000 * 60 * 60 * 2 * 2, false);

test.addTest('Exception rules', [
		'Mo-Fr 10:00-16:00; We 12:00-18:00'
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 16:00' ],
		[ '2012.10.02 10:00', '2012.10.02 16:00' ],
		[ '2012.10.03 12:00', '2012.10.03 18:00' ], // Not 10:00-18:00
		[ '2012.10.04 10:00', '2012.10.04 16:00' ],
		[ '2012.10.05 10:00', '2012.10.05 16:00' ],
	], 1000 * 60 * 60 * 6 * 5, true);

test.addTest('Month ranges', [
		'Nov-Feb 00:00-24:00',
		'Jan,Feb,Nov,Dec 00:00-24:00',
		'00:00-24:00; Mar-Oct off',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.01 00:00', '2012.03.01 00:00' ],
		[ '2012.11.01 00:00', '2013.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * (31 + 29 + 30 + 31), false);

// week ranges {{{
test.addTest('Week ranges', [
		'week 1,3 00:00-24:00',
		'week 1; week 3',
		'week 1-3/2 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.02 00:00', '2012.01.09 00:00' ],
		[ '2012.01.16 00:00', '2012.01.23 00:00' ],
		[ '2012.12.31 00:00', '2013.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * (2 * 7 + 1), false);

test.addTest('Week ranges', [
		'week 2,4 00:00-24:00',
		'week 2-4/2 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.09 00:00', '2012.01.16 00:00' ],
		[ '2012.01.23 00:00', '2012.01.30 00:00' ],
	], 1000 * 60 * 60 * 24 * (7 + 7), false);

test.addTest('Week range limit', [
		'week 2-53',
		'week 2-53 00:00-24:00',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		[ '2012.01.01 00:00', '2014.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * (365 * 2 + /* 2012 is leap year */ 1), false);


test.addTest('Week range full range', [
		'week 1-53',
		'week 1-53 00:00-24:00',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		[ '2012.01.01 00:00', '2014.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * (365 * 2 + /* 2012 is leap year */ 1), true);

test.addTest('Week range second week', [
		'week 2 00:00-24:00',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		[ '2012.01.09 00:00', '2012.01.16 00:00' ],
		[ '2013.01.07 00:00', '2013.01.14 00:00' ],
	], 1000 * 60 * 60 * 24 * 7 * 2, false);

test.addTest('Week range', [
		'week 2-53/2 We; week 1-53/2 Sa 00:00-24:00',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		/* Long test on per day base {{{ */
		[ '2012.01.07 00:00', '2012.01.08 00:00' ], // Sa, KW1
		[ '2012.01.11 00:00', '2012.01.12 00:00' ], // We, KW2
		[ '2012.01.21 00:00', '2012.01.22 00:00' ], // Sa, KW3
		[ '2012.01.25 00:00', '2012.01.26 00:00' ],
		[ '2012.02.04 00:00', '2012.02.05 00:00' ],
		[ '2012.02.08 00:00', '2012.02.09 00:00' ],
		[ '2012.02.18 00:00', '2012.02.19 00:00' ],
		[ '2012.02.22 00:00', '2012.02.23 00:00' ],
		[ '2012.03.03 00:00', '2012.03.04 00:00' ],
		[ '2012.03.07 00:00', '2012.03.08 00:00' ],
		[ '2012.03.17 00:00', '2012.03.18 00:00' ],
		[ '2012.03.21 00:00', '2012.03.22 00:00' ],
		[ '2012.03.31 00:00', '2012.04.01 00:00' ],
		[ '2012.04.04 00:00', '2012.04.05 00:00' ],
		[ '2012.04.14 00:00', '2012.04.15 00:00' ],
		[ '2012.04.18 00:00', '2012.04.19 00:00' ],
		[ '2012.04.28 00:00', '2012.04.29 00:00' ],
		[ '2012.05.02 00:00', '2012.05.03 00:00' ],
		[ '2012.05.12 00:00', '2012.05.13 00:00' ],
		[ '2012.05.16 00:00', '2012.05.17 00:00' ],
		[ '2012.05.26 00:00', '2012.05.27 00:00' ],
		[ '2012.05.30 00:00', '2012.05.31 00:00' ],
		[ '2012.06.09 00:00', '2012.06.10 00:00' ],
		[ '2012.06.13 00:00', '2012.06.14 00:00' ],
		[ '2012.06.23 00:00', '2012.06.24 00:00' ],
		[ '2012.06.27 00:00', '2012.06.28 00:00' ],
		[ '2012.07.07 00:00', '2012.07.08 00:00' ],
		[ '2012.07.11 00:00', '2012.07.12 00:00' ],
		[ '2012.07.21 00:00', '2012.07.22 00:00' ],
		[ '2012.07.25 00:00', '2012.07.26 00:00' ],
		[ '2012.08.04 00:00', '2012.08.05 00:00' ],
		[ '2012.08.08 00:00', '2012.08.09 00:00' ],
		[ '2012.08.18 00:00', '2012.08.19 00:00' ],
		[ '2012.08.22 00:00', '2012.08.23 00:00' ],
		[ '2012.09.01 00:00', '2012.09.02 00:00' ],
		[ '2012.09.05 00:00', '2012.09.06 00:00' ],
		[ '2012.09.15 00:00', '2012.09.16 00:00' ],
		[ '2012.09.19 00:00', '2012.09.20 00:00' ],
		[ '2012.09.29 00:00', '2012.09.30 00:00' ],
		[ '2012.10.03 00:00', '2012.10.04 00:00' ],
		[ '2012.10.13 00:00', '2012.10.14 00:00' ],
		[ '2012.10.17 00:00', '2012.10.18 00:00' ],
		[ '2012.10.27 00:00', '2012.10.28 00:00' ],
		[ '2012.10.31 00:00', '2012.11.01 00:00' ],
		[ '2012.11.10 00:00', '2012.11.11 00:00' ],
		[ '2012.11.14 00:00', '2012.11.15 00:00' ],
		[ '2012.11.24 00:00', '2012.11.25 00:00' ],
		[ '2012.11.28 00:00', '2012.11.29 00:00' ],
		[ '2012.12.08 00:00', '2012.12.09 00:00' ],
		[ '2012.12.12 00:00', '2012.12.13 00:00' ],
		[ '2012.12.22 00:00', '2012.12.23 00:00' ], // Sa, KW51
		[ '2012.12.26 00:00', '2012.12.27 00:00' ], // We, KW52
		[ '2013.01.05 00:00', '2013.01.06 00:00' ], // Sa, KW01
		[ '2013.01.09 00:00', '2013.01.10 00:00' ],
		[ '2013.01.19 00:00', '2013.01.20 00:00' ],
		[ '2013.01.23 00:00', '2013.01.24 00:00' ],
		[ '2013.02.02 00:00', '2013.02.03 00:00' ],
		[ '2013.02.06 00:00', '2013.02.07 00:00' ],
		[ '2013.02.16 00:00', '2013.02.17 00:00' ],
		[ '2013.02.20 00:00', '2013.02.21 00:00' ],
		[ '2013.03.02 00:00', '2013.03.03 00:00' ],
		[ '2013.03.06 00:00', '2013.03.07 00:00' ],
		[ '2013.03.16 00:00', '2013.03.17 00:00' ],
		[ '2013.03.20 00:00', '2013.03.21 00:00' ],
		[ '2013.03.30 00:00', '2013.03.31 00:00' ],
		[ '2013.04.03 00:00', '2013.04.04 00:00' ],
		[ '2013.04.13 00:00', '2013.04.14 00:00' ],
		[ '2013.04.17 00:00', '2013.04.18 00:00' ],
		[ '2013.04.27 00:00', '2013.04.28 00:00' ],
		[ '2013.05.01 00:00', '2013.05.02 00:00' ],
		[ '2013.05.11 00:00', '2013.05.12 00:00' ],
		[ '2013.05.15 00:00', '2013.05.16 00:00' ],
		[ '2013.05.25 00:00', '2013.05.26 00:00' ],
		[ '2013.05.29 00:00', '2013.05.30 00:00' ],
		[ '2013.06.08 00:00', '2013.06.09 00:00' ],
		[ '2013.06.12 00:00', '2013.06.13 00:00' ],
		[ '2013.06.22 00:00', '2013.06.23 00:00' ],
		[ '2013.06.26 00:00', '2013.06.27 00:00' ],
		[ '2013.07.06 00:00', '2013.07.07 00:00' ],
		[ '2013.07.10 00:00', '2013.07.11 00:00' ],
		[ '2013.07.20 00:00', '2013.07.21 00:00' ],
		[ '2013.07.24 00:00', '2013.07.25 00:00' ],
		[ '2013.08.03 00:00', '2013.08.04 00:00' ],
		[ '2013.08.07 00:00', '2013.08.08 00:00' ],
		[ '2013.08.17 00:00', '2013.08.18 00:00' ],
		[ '2013.08.21 00:00', '2013.08.22 00:00' ],
		[ '2013.08.31 00:00', '2013.09.01 00:00' ],
		[ '2013.09.04 00:00', '2013.09.05 00:00' ],
		[ '2013.09.14 00:00', '2013.09.15 00:00' ],
		[ '2013.09.18 00:00', '2013.09.19 00:00' ],
		[ '2013.09.28 00:00', '2013.09.29 00:00' ],
		[ '2013.10.02 00:00', '2013.10.03 00:00' ],
		[ '2013.10.12 00:00', '2013.10.13 00:00' ],
		[ '2013.10.16 00:00', '2013.10.17 00:00' ],
		[ '2013.10.26 00:00', '2013.10.27 00:00' ],
		[ '2013.10.30 00:00', '2013.10.31 00:00' ],
		[ '2013.11.09 00:00', '2013.11.10 00:00' ],
		[ '2013.11.13 00:00', '2013.11.14 00:00' ],
		[ '2013.11.23 00:00', '2013.11.24 00:00' ],
		[ '2013.11.27 00:00', '2013.11.28 00:00' ],
		[ '2013.12.07 00:00', '2013.12.08 00:00' ],
		[ '2013.12.11 00:00', '2013.12.12 00:00' ],
		[ '2013.12.21 00:00', '2013.12.22 00:00' ], // Sa, KW51
		[ '2013.12.25 00:00', '2013.12.26 00:00' ], // We, KW52
		/* }}} */
	], 1000 * 60 * 60 * 24 * 104, false);

(function() {
var week_range_result = [
	[
		[ '2012.01.23 00:00', '2012.04.23 00:00' ],
		[ '2013.01.21 00:00', '2013.04.22 00:00' ],
		[ '2014.01.20 00:00', '2014.04.21 00:00' ],
		[ '2015.01.19 00:00', '2015.04.20 00:00' ],
		[ '2016.01.25 00:00', '2016.04.25 00:00' ],
		[ '2017.01.23 00:00', '2017.04.24 00:00' ],
		// Checked against http://www.schulferien.org/kalenderwoche/kalenderwochen_2017.html
	], 1000 * 60 * 60 * (24 * 7 * 6 * (16 - 3) - /* daylight saving */ 6), 0 ];

test.addTest('Week range (beginning in last year)', [
		'week 4-16',
	], '2011.12.30 0:00', '2018.01.01 0:00', week_range_result[0],
	week_range_result[1], false);

test.addTest('Week range (beginning in matching year)', [
		'week 4-16',
	], '2012.01.01 0:00', '2018.01.01 0:00', week_range_result[0],
	week_range_result[1], false);
})();

test.addTest('Week range first week', [
		'week 1',
	], '2014.12.01 0:00', '2015.02.01 0:00', [
		[ '2014.12.29 00:00', '2015.01.05 00:00' ],
	], 1000 * 60 * 60 * 24 * 7, false);

test.addTest('Week range first week', [
		'week 1',
		'week 1 00:00-24:00',
	], '2012.12.01 0:00', '2024.02.01 0:00', [
		[ '2012.12.31 00:00', '2013.01.07 00:00' ],
		[ '2013.12.30 00:00', '2014.01.06 00:00' ],
		[ '2014.12.29 00:00', '2015.01.05 00:00' ],
		[ '2016.01.04 00:00', '2016.01.11 00:00' ],
		[ '2017.01.02 00:00', '2017.01.09 00:00' ],
		[ '2018.01.01 00:00', '2018.01.08 00:00' ],
		[ '2018.12.31 00:00', '2019.01.07 00:00' ],
		[ '2019.12.30 00:00', '2020.01.06 00:00' ],
		[ '2021.01.04 00:00', '2021.01.11 00:00' ],
		[ '2022.01.03 00:00', '2022.01.10 00:00' ],
		[ '2023.01.02 00:00', '2023.01.09 00:00' ],
		[ '2024.01.01 00:00', '2024.01.08 00:00' ],
		// Checked against http://www.schulferien.org/kalenderwoche/kalenderwochen_2024.html
	], 1000 * 60 * 60 * 24 * 7 * 12, false);

test.addTest('Week range first week', [
		'week 1 00:00-23:59',
	], '2012.12.01 0:00', '2024.02.01 0:00', [
		/* Long test on per day base {{{ */
		[ '2012.12.31 00:00', '2012.12.31 23:59' ],
		[ '2013.01.01 00:00', '2013.01.01 23:59' ],
		[ '2013.01.02 00:00', '2013.01.02 23:59' ],
		[ '2013.01.03 00:00', '2013.01.03 23:59' ],
		[ '2013.01.04 00:00', '2013.01.04 23:59' ],
		[ '2013.01.05 00:00', '2013.01.05 23:59' ],
		[ '2013.01.06 00:00', '2013.01.06 23:59' ],
		[ '2013.12.30 00:00', '2013.12.30 23:59' ],
		[ '2013.12.31 00:00', '2013.12.31 23:59' ],
		[ '2014.01.01 00:00', '2014.01.01 23:59' ],
		[ '2014.01.02 00:00', '2014.01.02 23:59' ],
		[ '2014.01.03 00:00', '2014.01.03 23:59' ],
		[ '2014.01.04 00:00', '2014.01.04 23:59' ],
		[ '2014.01.05 00:00', '2014.01.05 23:59' ],
		[ '2014.12.29 00:00', '2014.12.29 23:59' ],
		[ '2014.12.30 00:00', '2014.12.30 23:59' ],
		[ '2014.12.31 00:00', '2014.12.31 23:59' ],
		[ '2015.01.01 00:00', '2015.01.01 23:59' ],
		[ '2015.01.02 00:00', '2015.01.02 23:59' ],
		[ '2015.01.03 00:00', '2015.01.03 23:59' ],
		[ '2015.01.04 00:00', '2015.01.04 23:59' ],
		[ '2016.01.04 00:00', '2016.01.04 23:59' ],
		[ '2016.01.05 00:00', '2016.01.05 23:59' ],
		[ '2016.01.06 00:00', '2016.01.06 23:59' ],
		[ '2016.01.07 00:00', '2016.01.07 23:59' ],
		[ '2016.01.08 00:00', '2016.01.08 23:59' ],
		[ '2016.01.09 00:00', '2016.01.09 23:59' ],
		[ '2016.01.10 00:00', '2016.01.10 23:59' ],
		[ '2017.01.02 00:00', '2017.01.02 23:59' ],
		[ '2017.01.03 00:00', '2017.01.03 23:59' ],
		[ '2017.01.04 00:00', '2017.01.04 23:59' ],
		[ '2017.01.05 00:00', '2017.01.05 23:59' ],
		[ '2017.01.06 00:00', '2017.01.06 23:59' ],
		[ '2017.01.07 00:00', '2017.01.07 23:59' ],
		[ '2017.01.08 00:00', '2017.01.08 23:59' ],
		[ '2018.01.01 00:00', '2018.01.01 23:59' ],
		[ '2018.01.02 00:00', '2018.01.02 23:59' ],
		[ '2018.01.03 00:00', '2018.01.03 23:59' ],
		[ '2018.01.04 00:00', '2018.01.04 23:59' ],
		[ '2018.01.05 00:00', '2018.01.05 23:59' ],
		[ '2018.01.06 00:00', '2018.01.06 23:59' ],
		[ '2018.01.07 00:00', '2018.01.07 23:59' ],
		[ '2018.12.31 00:00', '2018.12.31 23:59' ],
		[ '2019.01.01 00:00', '2019.01.01 23:59' ],
		[ '2019.01.02 00:00', '2019.01.02 23:59' ],
		[ '2019.01.03 00:00', '2019.01.03 23:59' ],
		[ '2019.01.04 00:00', '2019.01.04 23:59' ],
		[ '2019.01.05 00:00', '2019.01.05 23:59' ],
		[ '2019.01.06 00:00', '2019.01.06 23:59' ],
		[ '2019.12.30 00:00', '2019.12.30 23:59' ],
		[ '2019.12.31 00:00', '2019.12.31 23:59' ],
		[ '2020.01.01 00:00', '2020.01.01 23:59' ],
		[ '2020.01.02 00:00', '2020.01.02 23:59' ],
		[ '2020.01.03 00:00', '2020.01.03 23:59' ],
		[ '2020.01.04 00:00', '2020.01.04 23:59' ],
		[ '2020.01.05 00:00', '2020.01.05 23:59' ],
		[ '2021.01.04 00:00', '2021.01.04 23:59' ],
		[ '2021.01.05 00:00', '2021.01.05 23:59' ],
		[ '2021.01.06 00:00', '2021.01.06 23:59' ],
		[ '2021.01.07 00:00', '2021.01.07 23:59' ],
		[ '2021.01.08 00:00', '2021.01.08 23:59' ],
		[ '2021.01.09 00:00', '2021.01.09 23:59' ],
		[ '2021.01.10 00:00', '2021.01.10 23:59' ],
		[ '2022.01.03 00:00', '2022.01.03 23:59' ],
		[ '2022.01.04 00:00', '2022.01.04 23:59' ],
		[ '2022.01.05 00:00', '2022.01.05 23:59' ],
		[ '2022.01.06 00:00', '2022.01.06 23:59' ],
		[ '2022.01.07 00:00', '2022.01.07 23:59' ],
		[ '2022.01.08 00:00', '2022.01.08 23:59' ],
		[ '2022.01.09 00:00', '2022.01.09 23:59' ],
		[ '2023.01.02 00:00', '2023.01.02 23:59' ],
		[ '2023.01.03 00:00', '2023.01.03 23:59' ],
		[ '2023.01.04 00:00', '2023.01.04 23:59' ],
		[ '2023.01.05 00:00', '2023.01.05 23:59' ],
		[ '2023.01.06 00:00', '2023.01.06 23:59' ],
		[ '2023.01.07 00:00', '2023.01.07 23:59' ],
		[ '2023.01.08 00:00', '2023.01.08 23:59' ],
		[ '2024.01.01 00:00', '2024.01.01 23:59' ],
		[ '2024.01.02 00:00', '2024.01.02 23:59' ],
		[ '2024.01.03 00:00', '2024.01.03 23:59' ],
		[ '2024.01.04 00:00', '2024.01.04 23:59' ],
		[ '2024.01.05 00:00', '2024.01.05 23:59' ],
		[ '2024.01.06 00:00', '2024.01.06 23:59' ],
		[ '2024.01.07 00:00', '2024.01.07 23:59' ],
		/* }}} */
	], 1000 * 60 * (60 * 24 * 7 * 12 - 7 * 12), false);
// }}}

test.addTest('Monthday ranges', [
		'Jan 23-31 00:00-24:00; Feb 1-12 00:00-24:00',
		'Jan 23-Feb 12 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.23 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 21, false);

test.addTest('Monthday ranges spanning year boundary', [
		'Dec 31-Jan 01',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		[ '2012.01.01 0:00', '2012.01.02 00:00' ],
		[ '2012.12.31 0:00', '2013.01.02 00:00' ],
		[ '2013.12.31 0:00', '2014.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, false);

test.addTest('Periodical monthdays', [
		'Jan 01-31/8 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.01 0:00', '2012.01.02 00:00' ],
		[ '2012.01.09 0:00', '2012.01.10 00:00' ],
		[ '2012.01.17 0:00', '2012.01.18 00:00' ],
		[ '2012.01.25 0:00', '2012.01.26 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, false);

test.addTest('Periodical monthdays', [
		'Jan 10-31/7',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.10 0:00', '2012.01.11 00:00' ],
		[ '2012.01.17 0:00', '2012.01.18 00:00' ],
		[ '2012.01.24 0:00', '2012.01.25 00:00' ],
		[ '2012.01.31 0:00', '2012.02.01 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, false);

test.addTest('Selector order', [ // result should not depend on selector order
		'Feb week 6',
		'week 6 Feb',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
        [ '2012.02.06 00:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 5, false);

test.addTest('Selector order', [
		'Feb week 7',
		'week 7 Feb',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.02.06 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 7, false);

test.addTest('Input tolerance: case and whitespace', [
		'   mo,    Tu, wE,   TH    12:00 - 20:00  ; 14:00-16:00    Off  ',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 14:00' ],
		[ '2012.10.01 16:00', '2012.10.01 20:00' ],
		[ '2012.10.02 12:00', '2012.10.02 14:00' ],
		[ '2012.10.02 16:00', '2012.10.02 20:00' ],
		[ '2012.10.03 12:00', '2012.10.03 14:00' ],
		[ '2012.10.03 16:00', '2012.10.03 20:00' ],
		[ '2012.10.04 12:00', '2012.10.04 14:00' ],
		[ '2012.10.04 16:00', '2012.10.04 20:00' ],
	], 1000 * 60 * 60 * 6 * 4, true);

test.addTest('Input tolerance: dot as time separator', [
		'10.00-12.00',
		'10.00-11.00,11.00-12.00',
		'10.00-11.00;11.00-12.00',
		'10.00-14.00;12.00-14.00 off',
		'10.00-12.00;10.30-11.30',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 12:00' ],
		[ '2012.10.02 10:00', '2012.10.02 12:00' ],
		[ '2012.10.03 10:00', '2012.10.03 12:00' ],
		[ '2012.10.04 10:00', '2012.10.04 12:00' ],
		[ '2012.10.05 10:00', '2012.10.05 12:00' ],
		[ '2012.10.06 10:00', '2012.10.06 12:00' ],
		[ '2012.10.07 10:00', '2012.10.07 12:00' ],
	], 1000 * 60 * 60 * 2 * 7, true);

test.addTest('Extensions: complex monthday ranges', [
		'Jan 23-31,Feb 1-12 00:00-24:00',
		'Jan 23-Feb 11,Feb 12 00:00-24:00',
		ignored('Jan 23-30,31-Feb 1-2,3-12 12 00:00-24:00'),
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.23 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 21, false);

test.addTest('Extensions: missing time range separators', [
		'Mo 12:00-14:00 16:00-18:00 20:00-22:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 14:00' ],
		[ '2012.10.01 16:00', '2012.10.01 18:00' ],
		[ '2012.10.01 20:00', '2012.10.01 22:00' ],
	], 1000 * 60 * 60 * 6, true);

test.addTest('Selector combination', [
		'week 3 We', // week + weekday
		'week 3 Jan 11-Jan 11', // week + monthday
		'week 3 Jan 11', // week + monthday
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.11 0:00', '2012.01.12 00:00' ],
	], 1000 * 60 * 60 * 24, false);

test.addTest('Selector combination', [
		'week 3 Jan', // week + month
		'Jan-Feb Jan 9-Jan 15', // month + monthday
		'Jan-Feb Jan 9-15', // month + monthday
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.09 0:00', '2012.01.16 00:00' ],
	], 1000 * 60 * 60 * 24 * 7, false);

test.addTest('Selector combination', [
		'Jan We', // month + weekday
		'Jan 2-27 We', // weekday + monthday
		'Dec 30-Jan 27 We', // weekday + monthday
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.04 0:00', '2012.01.05 00:00' ],
		[ '2012.01.11 0:00', '2012.01.12 00:00' ],
		[ '2012.01.18 0:00', '2012.01.19 00:00' ],
		[ '2012.01.25 0:00', '2012.01.26 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, false);

process.exit(test.run() ? 0 : 1);

//======================================================================
// Test framework
//======================================================================
function opening_hours_test() {
	var tests = [];

	function runSingleTest(name, value, from, to, expected_intervals, expected_duration, expected_weekstable) {
		var ignored = typeof value !== 'string';
		if (ignored) {
			ignored = value[1];
			value   = value[0];
		}

		var oh, intervals, duration, weekstable, intervals_ok, duration_ok, weekstable_ok, crashed = true;

		try {
			oh = new opening_hours(value);

			intervals  = oh.getOpenIntervals(new Date(from), new Date(to));
			duration   = oh.getOpenDuration(new Date(from), new Date(to));
			weekstable = oh.isWeekStable();

			intervals_ok  = typeof expected_intervals  === 'undefined' || intervals.length == expected_intervals.length;
			duration_ok   = typeof expected_duration   === 'undefined' || duration === expected_duration;
			weekstable_ok = typeof expected_weekstable === 'undefined' || weekstable === expected_weekstable;

			crashed = false;
		} catch (err) {
			crashed = err;
		}

		if (intervals_ok) {
			for (var interval = 0; interval < intervals.length; interval++) {
				var expected_from = new Date(expected_intervals[interval][0]);
				var expected_to   = new Date(expected_intervals[interval][1]);

				if (intervals[interval][0].getTime() != expected_from.getTime() ||
						intervals[interval][1].getTime() != expected_to.getTime())
					intervals_ok = false;
			}
		}

		var passed = false;
		var str = '"' + name + '" for "' + value + '": ';
		if (intervals_ok && duration_ok && weekstable_ok) {
			str += '[1;32mPASSED[0m';
			if (ignored)
				str += ', [1;33malso ignored, please unignore since the test passes![0m';
			passed = true;
		} else if (ignored) {
			str += '[1;33mIGNORED[0m, reason: ' + ignored;
			passed = true;
		} else if (crashed) {
			str += '[1;35mCRASHED[0m, reason: ' + crashed;
		} else {
			str += '[1;31mFAILED[0m';
			if (!duration_ok)
				str += ', bad duration: ' + duration + ', expected ' + expected_duration;
			if (!intervals_ok)
				str += ', bad intervals: \n' + intervalsToString(intervals) + '\nexpected:\n' + intervalsToString(expected_intervals);
			if (!weekstable_ok)
				str += ', bad weekstable flag: ' + weekstable + ', expected ' + expected_weekstable;
		}

		console.log(str);
		return passed;
	}

	function intervalsToString(intervals) {
		var res = '';

		if (intervals.length == 0)
			return '(none)';

		for (var interval = 0; interval < intervals.length; interval++) {
			var from = formatDate(intervals[interval][0]);
			var to   = formatDate(intervals[interval][1]);

			if (interval != 0)
				res += '\n';

			res += '[ ' + from + ' - ' + to + ' ]';
		}

		return res;
	}

	function formatDate(date) {
		if (typeof date === 'string')
			return date;

		var res = '';
		res += date.getFullYear() + '.';
		res += ('0' + (date.getMonth() + 1)).substr(-2, 2) + '.';
		res += ('0' + date.getDate()).substr(-2, 2) + ' ';
		res += ('0' + date.getHours()).substr(-2, 2) + ':';
		res += ('0' + date.getMinutes()).substr(-2, 2);
		return res;
	}

	this.run = function() {
		var success = 0;
		for (var test = 0; test < tests.length; test++) {
			if (runSingleTest(tests[test][0], tests[test][1], tests[test][2], tests[test][3], tests[test][4], tests[test][5], tests[test][6]))
				success++;
		}

		console.log(success + '/' + tests.length + ' tests passed');

		return success == tests.length;
	}

	this.addTest = function(name, values, from, to, expected_intervals, expected_duration, expected_weekstable) {
		if (typeof values === 'string')
			tests.push([name, values, from, to, expected_intervals, expected_duration, expected_weekstable]);
		else
			for (var value = 0; value < values.length; value++)
				tests.push([name, values[value], from, to, expected_intervals, expected_duration, expected_weekstable]);
	}
}

function ignored(value, reason) {
	if (typeof reason === 'undefined')
		reason = 'not implemented yet';
	return [ value, reason ];
}
