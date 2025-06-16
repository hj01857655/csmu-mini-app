/**
 * 课程时间标准化工具
 * 统一课程时间显示格式为50分钟/节
 */

import dateFormatter from './date-formatter.js';

class CourseTimeManager {
	constructor() {
		// 标准课程时间表（50分钟/节）
		this.standardTimeSlots = {
			// 上午时间段
			1: { start: '08:00', end: '08:50', period: '第1节' },
			2: { start: '09:00', end: '09:50', period: '第2节' },
			3: { start: '10:10', end: '11:00', period: '第3节' },
			4: { start: '11:10', end: '12:00', period: '第4节' },

			// 下午时间段
			5: { start: '14:00', end: '14:50', period: '第5节' },
			6: { start: '15:00', end: '15:50', period: '第6节' },
			7: { start: '16:10', end: '17:00', period: '第7节' },
			8: { start: '17:10', end: '18:00', period: '第8节' },

			// 晚上时间段
			9: { start: '19:00', end: '19:50', period: '第9节' },
			10: { start: '20:00', end: '20:50', period: '第10节' },
			11: { start: '21:00', end: '21:50', period: '第11节' }
		};

		// 时间段分组
		this.timeGroups = {
			morning: [1, 2, 3, 4],
			afternoon: [5, 6, 7, 8],
			evening: [9, 10, 11]
		};

		// 时间段名称
		this.timeGroupNames = {
			morning: '上午',
			afternoon: '下午',
			evening: '晚上'
		};
	}

	/**
	 * 获取标准时间段信息
	 * @param {number} slotNumber - 时间段编号
	 * @returns {Object|null} 时间段信息
	 */
	getTimeSlot(slotNumber) {
		return this.standardTimeSlots[slotNumber] || null;
	}

	/**
	 * 获取连续时间段的时间范围
	 * @param {Array} slotNumbers - 连续的时间段编号数组
	 * @returns {Object} 时间范围信息
	 */
	getContinuousTimeRange(slotNumbers) {
		if (!Array.isArray(slotNumbers) || slotNumbers.length === 0) {
			return null;
		}

		// 排序时间段编号
		const sortedSlots = [...slotNumbers].sort((a, b) => a - b);
		const firstSlot = this.getTimeSlot(sortedSlots[0]);
		const lastSlot = this.getTimeSlot(sortedSlots[sortedSlots.length - 1]);

		if (!firstSlot || !lastSlot) {
			return null;
		}

		return {
			startTime: firstSlot.start,
			endTime: lastSlot.end,
			timeRange: `${firstSlot.start}-${lastSlot.end}`,
			periods: sortedSlots.map(slot => this.getTimeSlot(slot).period),
			periodRange: sortedSlots.length === 1
				? firstSlot.period
				: `${firstSlot.period}-${lastSlot.period}`,
			duration: sortedSlots.length * 50, // 每节课50分钟
			slotCount: sortedSlots.length
		};
	}

	/**
	 * 格式化课程时间显示
	 * @param {Array|number} slots - 时间段编号或编号数组
	 * @param {string} format - 显示格式 ('time'|'period'|'full')
	 * @returns {string} 格式化后的时间字符串
	 */
	formatCourseTime(slots, format = 'time') {
		const slotArray = Array.isArray(slots) ? slots : [slots];
		const timeRange = this.getContinuousTimeRange(slotArray);

		if (!timeRange) {
			return '时间待定';
		}

		switch (format) {
			case 'time':
				return dateFormatter.formatTimeRange(timeRange.startTime, timeRange.endTime);
			case 'period':
				return timeRange.periodRange;
			case 'full':
				return `${timeRange.periodRange} (${dateFormatter.formatTimeRange(timeRange.startTime, timeRange.endTime)})`;
			default:
				return dateFormatter.formatTimeRange(timeRange.startTime, timeRange.endTime);
		}
	}

	/**
	 * 获取时间段所属的时间组
	 * @param {number} slotNumber - 时间段编号
	 * @returns {string|null} 时间组名称
	 */
	getTimeGroup(slotNumber) {
		for (const [groupName, slots] of Object.entries(this.timeGroups)) {
			if (slots.includes(slotNumber)) {
				return groupName;
			}
		}
		return null;
	}

	/**
	 * 获取时间组的中文名称
	 * @param {string} groupName - 时间组名称
	 * @returns {string} 中文名称
	 */
	getTimeGroupDisplayName(groupName) {
		return this.timeGroupNames[groupName] || groupName;
	}

	/**
	 * 检查时间段是否连续
	 * @param {Array} slotNumbers - 时间段编号数组
	 * @returns {boolean} 是否连续
	 */
	isContinuousSlots(slotNumbers) {
		if (!Array.isArray(slotNumbers) || slotNumbers.length <= 1) {
			return true;
		}

		const sortedSlots = [...slotNumbers].sort((a, b) => a - b);
		for (let i = 1; i < sortedSlots.length; i++) {
			if (sortedSlots[i] - sortedSlots[i - 1] !== 1) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 解析旧格式的时间字符串
	 * @param {string} timeString - 旧格式时间字符串（如 "08:00-09:40"）
	 * @returns {Array} 对应的时间段编号数组
	 */
	parseOldTimeFormat(timeString) {
		if (!timeString || typeof timeString !== 'string') {
			return [];
		}

		// 匹配时间格式 HH:MM-HH:MM
		const timeMatch = timeString.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
		if (!timeMatch) {
			return [];
		}

		const startHour = parseInt(timeMatch[1]);
		const startMinute = parseInt(timeMatch[2]);
		const endHour = parseInt(timeMatch[3]);
		const endMinute = parseInt(timeMatch[4]);

		// 查找匹配的时间段
		const matchedSlots = [];
		for (const [slotNum, slot] of Object.entries(this.standardTimeSlots)) {
			const slotStartTime = slot.start.split(':');
			const slotEndTime = slot.end.split(':');
			const slotStartHour = parseInt(slotStartTime[0]);
			const slotStartMinute = parseInt(slotStartTime[1]);
			const slotEndHour = parseInt(slotEndTime[0]);
			const slotEndMinute = parseInt(slotEndTime[1]);

			// 检查时间段是否在指定范围内
			const slotStartTotal = slotStartHour * 60 + slotStartMinute;
			const slotEndTotal = slotEndHour * 60 + slotEndMinute;
			const rangeStartTotal = startHour * 60 + startMinute;
			const rangeEndTotal = endHour * 60 + endMinute;

			if (slotStartTotal >= rangeStartTotal && slotEndTotal <= rangeEndTotal) {
				matchedSlots.push(parseInt(slotNum));
			}
		}

		return matchedSlots.sort((a, b) => a - b);
	}

	/**
	 * 转换课程数据中的时间格式
	 * @param {Object} courseData - 课程数据
	 * @returns {Object} 转换后的课程数据
	 */
	standardizeCourseTime(courseData) {
		if (!courseData) {
			return courseData;
		}

		const result = { ...courseData };

		// 如果有旧格式的时间字段，转换为标准格式
		if (result.time && typeof result.time === 'string') {
			const slots = this.parseOldTimeFormat(result.time);
			if (slots.length > 0) {
				result.timeSlots = slots;
				result.time = this.formatCourseTime(slots, 'time');
				result.period = this.formatCourseTime(slots, 'period');
				result.fullTime = this.formatCourseTime(slots, 'full');
			}
		}

		// 如果有时间段数组，确保时间字符串是标准格式
		if (result.timeSlots && Array.isArray(result.timeSlots)) {
			result.time = this.formatCourseTime(result.timeSlots, 'time');
			result.period = this.formatCourseTime(result.timeSlots, 'period');
			result.fullTime = this.formatCourseTime(result.timeSlots, 'full');
		}

		return result;
	}

	/**
	 * 获取所有时间段选项（用于选择器）
	 * @returns {Array} 时间段选项数组
	 */
	getAllTimeSlotOptions() {
		const options = [];

		for (const [groupName, slots] of Object.entries(this.timeGroups)) {
			const groupDisplayName = this.getTimeGroupDisplayName(groupName);

			for (const slotNum of slots) {
				const slot = this.getTimeSlot(slotNum);
				if (slot) {
					options.push({
						value: slotNum,
						label: `${slot.period} (${slot.start}-${slot.end})`,
						group: groupName,
						groupDisplayName: groupDisplayName,
						time: slot
					});
				}
			}
		}

		return options;
	}

	/**
	 * 验证时间段配置
	 * @param {Array} slotNumbers - 时间段编号数组
	 * @returns {Object} 验证结果
	 */
	validateTimeSlots(slotNumbers) {
		const result = {
			isValid: true,
			errors: [],
			warnings: []
		};

		if (!Array.isArray(slotNumbers)) {
			result.isValid = false;
			result.errors.push('时间段必须是数组格式');
			return result;
		}

		if (slotNumbers.length === 0) {
			result.isValid = false;
			result.errors.push('至少需要选择一个时间段');
			return result;
		}

		// 检查时间段是否存在
		for (const slotNum of slotNumbers) {
			if (!this.getTimeSlot(slotNum)) {
				result.isValid = false;
				result.errors.push(`时间段 ${slotNum} 不存在`);
			}
		}

		// 检查是否连续
		if (!this.isContinuousSlots(slotNumbers)) {
			result.warnings.push('时间段不连续，可能影响课程安排');
		}

		// 检查是否跨越不同时间组
		const groups = new Set();
		for (const slotNum of slotNumbers) {
			const group = this.getTimeGroup(slotNum);
			if (group) {
				groups.add(group);
			}
		}

		if (groups.size > 1) {
			result.warnings.push('课程跨越多个时间段（如上午和下午），请确认是否正确');
		}

		return result;
	}
}

// 创建全局实例
const courseTimeManager = new CourseTimeManager();

export default courseTimeManager;
