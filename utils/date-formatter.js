/**
 * 统一的日期时间格式化工具
 * 确保所有时间显示使用24小时制格式
 */

class DateFormatter {
	constructor() {
		// 24小时制的本地化选项
		this.timeOptions24h = {
			hour12: false,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};

		// 仅日期的选项
		this.dateOnlyOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};

		// 仅时间的选项（24小时制）
		this.timeOnlyOptions = {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};

		// 简短时间选项（不含秒）
		this.shortTimeOptions = {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit'
		};
	}

	/**
	 * 格式化完整的日期时间（24小时制）
	 * @param {Date|string|number} date - 日期对象、字符串或时间戳
	 * @param {string} format - 格式类型 ('standard'|'chinese'|'iso')
	 * @returns {string} 格式化后的日期时间字符串
	 */
	formatDateTime(date, format = 'standard') {
		const dateObj = this.ensureDate(date);
		if (!dateObj) return '无效日期';

		switch (format) {
			case 'chinese':
				// 中文格式：2025年6月16日 00:54:42
				return dateObj.toLocaleString('zh-CN', {
					...this.timeOptions24h,
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1年$2月$3日');
			
			case 'iso':
				// ISO格式：2025-06-16 00:54:42
				return this.formatISO(dateObj);
			
			case 'standard':
			default:
				// 标准格式：2025/06/16 00:54:42
				return dateObj.toLocaleString('zh-CN', this.timeOptions24h);
		}
	}

	/**
	 * 格式化日期（不含时间）
	 * @param {Date|string|number} date - 日期
	 * @param {string} format - 格式类型
	 * @returns {string} 格式化后的日期字符串
	 */
	formatDate(date, format = 'standard') {
		const dateObj = this.ensureDate(date);
		if (!dateObj) return '无效日期';

		switch (format) {
			case 'chinese':
				// 中文格式：2025年6月16日
				const year = dateObj.getFullYear();
				const month = dateObj.getMonth() + 1;
				const day = dateObj.getDate();
				return `${year}年${month}月${day}日`;
			
			case 'iso':
				// ISO格式：2025-06-16
				return dateObj.toISOString().split('T')[0];
			
			case 'slash':
				// 斜杠格式：2025/06/16
				return dateObj.toLocaleDateString('zh-CN');
			
			case 'standard':
			default:
				// 标准格式：2025-06-16
				return this.formatISO(dateObj).split(' ')[0];
		}
	}

	/**
	 * 格式化时间（不含日期）
	 * @param {Date|string|number} date - 日期时间
	 * @param {boolean} includeSeconds - 是否包含秒
	 * @returns {string} 格式化后的时间字符串
	 */
	formatTime(date, includeSeconds = true) {
		const dateObj = this.ensureDate(date);
		if (!dateObj) return '无效时间';

		const options = includeSeconds ? this.timeOnlyOptions : this.shortTimeOptions;
		return dateObj.toLocaleString('zh-CN', options);
	}

	/**
	 * 格式化为ISO格式
	 * @param {Date} date - 日期对象
	 * @returns {string} ISO格式字符串
	 */
	formatISO(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	/**
	 * 格式化相对时间（如：刚刚、5分钟前、2小时前）
	 * @param {Date|string|number} date - 日期时间
	 * @returns {string} 相对时间字符串
	 */
	formatRelativeTime(date) {
		const dateObj = this.ensureDate(date);
		if (!dateObj) return '无效时间';

		const now = new Date();
		const diff = now.getTime() - dateObj.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (seconds < 60) {
			return '刚刚';
		} else if (minutes < 60) {
			return `${minutes}分钟前`;
		} else if (hours < 24) {
			return `${hours}小时前`;
		} else if (days < 7) {
			return `${days}天前`;
		} else {
			// 超过7天显示具体日期
			return this.formatDate(dateObj, 'chinese');
		}
	}

	/**
	 * 格式化课程时间范围
	 * @param {string} startTime - 开始时间 (HH:MM)
	 * @param {string} endTime - 结束时间 (HH:MM)
	 * @returns {string} 时间范围字符串
	 */
	formatTimeRange(startTime, endTime) {
		if (!startTime || !endTime) return '时间待定';
		
		// 确保时间格式正确
		const formatTime = (time) => {
			if (time.length === 4) {
				return `0${time}`; // 补零
			}
			return time;
		};

		return `${formatTime(startTime)}-${formatTime(endTime)}`;
	}

	/**
	 * 格式化周次日期范围
	 * @param {Date} startDate - 周开始日期
	 * @param {Date} endDate - 周结束日期
	 * @returns {string} 周次日期范围字符串
	 */
	formatWeekRange(startDate, endDate) {
		const start = this.ensureDate(startDate);
		const end = this.ensureDate(endDate);
		
		if (!start || !end) return '日期无效';

		const startStr = this.formatDate(start, 'chinese');
		const endStr = this.formatDate(end, 'chinese');
		
		return `${startStr} - ${endStr}`;
	}

	/**
	 * 确保输入是Date对象
	 * @param {Date|string|number} input - 输入值
	 * @returns {Date|null} Date对象或null
	 */
	ensureDate(input) {
		if (input instanceof Date) {
			return isNaN(input.getTime()) ? null : input;
		}
		
		if (typeof input === 'string' || typeof input === 'number') {
			const date = new Date(input);
			return isNaN(date.getTime()) ? null : date;
		}
		
		return null;
	}

	/**
	 * 获取当前时间的格式化字符串
	 * @param {string} format - 格式类型
	 * @returns {string} 当前时间字符串
	 */
	getCurrentTime(format = 'standard') {
		return this.formatDateTime(new Date(), format);
	}

	/**
	 * 验证时间格式是否正确
	 * @param {string} timeString - 时间字符串
	 * @returns {boolean} 是否有效
	 */
	isValidTimeFormat(timeString) {
		// 验证 HH:MM 或 HH:MM:SS 格式
		const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
		return timeRegex.test(timeString);
	}

	/**
	 * 解析时间字符串为分钟数
	 * @param {string} timeString - 时间字符串 (HH:MM)
	 * @returns {number} 分钟数
	 */
	parseTimeToMinutes(timeString) {
		if (!this.isValidTimeFormat(timeString)) return 0;
		
		const [hours, minutes] = timeString.split(':').map(Number);
		return hours * 60 + minutes;
	}

	/**
	 * 将分钟数转换为时间字符串
	 * @param {number} minutes - 分钟数
	 * @returns {string} 时间字符串 (HH:MM)
	 */
	minutesToTimeString(minutes) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
	}

	/**
	 * 获取时间显示的调试信息
	 * @param {Date} date - 日期对象
	 * @returns {Object} 调试信息
	 */
	getDebugInfo(date = new Date()) {
		const dateObj = this.ensureDate(date);
		if (!dateObj) return { error: '无效日期' };

		return {
			original: date,
			timestamp: dateObj.getTime(),
			iso: dateObj.toISOString(),
			standard: this.formatDateTime(dateObj, 'standard'),
			chinese: this.formatDateTime(dateObj, 'chinese'),
			isoFormat: this.formatDateTime(dateObj, 'iso'),
			dateOnly: this.formatDate(dateObj),
			timeOnly: this.formatTime(dateObj),
			relative: this.formatRelativeTime(dateObj),
			timezone: dateObj.getTimezoneOffset(),
			locale: navigator.language || 'zh-CN'
		};
	}
}

// 创建全局实例
const dateFormatter = new DateFormatter();

export default dateFormatter;
