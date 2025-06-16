// 学期和周次计算工具
import dateFormatter from './date-formatter.js';

class SemesterCalculator {
	constructor() {
		// 学期配置 - 可根据实际学校情况调整
		this.semesterConfig = {
			// 2023-2024学年
			'2023-2024-1': {
				name: '2023-2024学年第一学期',
				startDate: '2023-09-04', // 第一周周一
				endDate: '2024-01-28',   // 学期结束
				weeks: 20,               // 总周数
				examWeeks: [19, 20],     // 考试周
				holidayWeeks: []         // 假期周（如国庆假期调整）
			},
			'2023-2024-2': {
				name: '2023-2024学年第二学期',
				startDate: '2024-02-26', // 第一周周一
				endDate: '2024-07-14',   // 学期结束
				weeks: 20,
				examWeeks: [19, 20],
				holidayWeeks: []
			},
			// 2024-2025学年
			'2024-2025-1': {
				name: '2024-2025学年第一学期',
				startDate: '2024-09-02', // 第一周周一
				endDate: '2025-01-26',   // 学期结束
				weeks: 20,
				examWeeks: [19, 20],
				holidayWeeks: []
			},
			'2024-2025-2': {
				name: '2024-2025学年第二学期',
				startDate: '2025-02-17', // 第一周周一（2025年2月17日）
				endDate: '2025-07-13',   // 学期结束（2025年7月13日）
				weeks: 20,
				examWeeks: [19, 20],
				holidayWeeks: []
			}
		};
	}

	/**
	 * 获取当前学期信息
	 * @param {Date} date - 指定日期，默认为当前日期
	 * @returns {Object} 学期信息
	 */
	getCurrentSemester(date = new Date()) {
		const currentDate = new Date(date);

		// 遍历所有学期配置，找到当前日期所属的学期
		for (const [semesterKey, config] of Object.entries(this.semesterConfig)) {
			const startDate = new Date(config.startDate);
			const endDate = new Date(config.endDate);

			if (currentDate >= startDate && currentDate <= endDate) {
				return {
					key: semesterKey,
					name: config.name,
					startDate: config.startDate,
					endDate: config.endDate,
					weeks: config.weeks,
					examWeeks: config.examWeeks,
					holidayWeeks: config.holidayWeeks
				};
			}
		}

		// 如果没有找到匹配的学期，返回最近的学期
		return this.getNearestSemester(currentDate);
	}

	/**
	 * 获取最近的学期（用于假期期间）
	 * @param {Date} date - 指定日期
	 * @returns {Object} 最近的学期信息
	 */
	getNearestSemester(date) {
		const currentDate = new Date(date);
		let nearestSemester = null;
		let minDistance = Infinity;

		for (const [semesterKey, config] of Object.entries(this.semesterConfig)) {
			const startDate = new Date(config.startDate);
			const endDate = new Date(config.endDate);

			// 计算到学期开始和结束的距离
			const distanceToStart = Math.abs(currentDate - startDate);
			const distanceToEnd = Math.abs(currentDate - endDate);
			const minDistanceToSemester = Math.min(distanceToStart, distanceToEnd);

			if (minDistanceToSemester < minDistance) {
				minDistance = minDistanceToSemester;
				nearestSemester = {
					key: semesterKey,
					name: config.name,
					startDate: config.startDate,
					endDate: config.endDate,
					weeks: config.weeks,
					examWeeks: config.examWeeks,
					holidayWeeks: config.holidayWeeks,
					isNearby: true // 标记这是最近的学期，不是当前学期
				};
			}
		}

		return nearestSemester;
	}

	/**
	 * 计算当前周次
	 * @param {Date} date - 指定日期，默认为当前日期
	 * @returns {Object} 周次信息
	 */
	getCurrentWeek(date = new Date()) {
		const semester = this.getCurrentSemester(date);
		if (!semester) {
			return { week: 1, isValid: false, message: '无法确定当前学期' };
		}

		const currentDate = new Date(date);
		const startDate = new Date(semester.startDate);

		// 如果是假期期间（最近学期）
		if (semester.isNearby) {
			return {
				week: 1,
				isValid: false,
				message: '当前为假期时间',
				semester: semester
			};
		}

		// 修复周次计算逻辑
		const week = this.calculateWeekNumber(currentDate, startDate);

		// 验证周次是否有效
		const isValid = week >= 1 && week <= semester.weeks;

		// 判断是否为考试周
		const isExamWeek = semester.examWeeks.includes(week);

		// 判断是否为假期周
		const isHolidayWeek = semester.holidayWeeks.includes(week);

		return {
			week: Math.max(1, Math.min(week, semester.weeks)),
			isValid,
			isExamWeek,
			isHolidayWeek,
			semester: semester,
			message: this.getWeekMessage(week, isExamWeek, isHolidayWeek, isValid)
		};
	}

	/**
	 * 计算周次的核心算法
	 * @param {Date} currentDate - 当前日期
	 * @param {Date} startDate - 学期开始日期（第一周周一）
	 * @returns {number} 周次
	 */
	calculateWeekNumber(currentDate, startDate) {
		// 确保startDate是周一0点
		const semesterStart = new Date(startDate);
		semesterStart.setHours(0, 0, 0, 0);

		// 确保currentDate包含时间信息
		const current = new Date(currentDate);

		// 计算当前日期是周几（0=周日, 1=周一, ..., 6=周六）
		const currentDayOfWeek = current.getDay();

		// 找到当前日期所在周的周一0点
		const currentWeekMonday = new Date(current);
		const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // 周日需要回退6天到周一
		currentWeekMonday.setDate(current.getDate() - daysToMonday);
		currentWeekMonday.setHours(0, 0, 0, 0);

		// 计算从学期开始到当前周周一的毫秒差
		const timeDiff = currentWeekMonday.getTime() - semesterStart.getTime();

		// 转换为天数差
		const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

		// 计算周次（从第1周开始）
		const week = Math.floor(daysDiff / 7) + 1;

		// 调试信息（使用24小时制格式）
		console.log('周次计算详情:', {
			currentDate: dateFormatter.formatDateTime(current, 'chinese'),
			currentDayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][currentDayOfWeek],
			currentWeekMonday: dateFormatter.formatDateTime(currentWeekMonday, 'chinese'),
			semesterStart: dateFormatter.formatDateTime(semesterStart, 'chinese'),
			daysDiff: daysDiff,
			calculatedWeek: week
		});

		return week;
	}

	/**
	 * 获取周次描述信息
	 * @param {number} week - 周次
	 * @param {boolean} isExamWeek - 是否为考试周
	 * @param {boolean} isHolidayWeek - 是否为假期周
	 * @param {boolean} isValid - 周次是否有效
	 * @returns {string} 描述信息
	 */
	getWeekMessage(week, isExamWeek, isHolidayWeek, isValid) {
		if (!isValid) {
			return '当前不在学期时间范围内';
		}

		if (isExamWeek) {
			return `第${week}周 (考试周)`;
		}

		if (isHolidayWeek) {
			return `第${week}周 (假期调整)`;
		}

		return `第${week}周`;
	}

	/**
	 * 获取指定周次的日期范围
	 * @param {number} week - 周次
	 * @param {Object} semester - 学期信息
	 * @returns {Object} 日期范围
	 */
	getWeekDateRange(week, semester = null) {
		if (!semester) {
			semester = this.getCurrentSemester();
		}

		const startDate = new Date(semester.startDate);

		// 计算指定周的开始日期（周一）
		const weekStartDate = new Date(startDate);
		weekStartDate.setDate(startDate.getDate() + (week - 1) * 7);

		// 计算指定周的结束日期（周日）
		const weekEndDate = new Date(weekStartDate);
		weekEndDate.setDate(weekStartDate.getDate() + 6);

		return {
			startDate: weekStartDate,
			endDate: weekEndDate,
			startDateStr: this.formatDate(weekStartDate),
			endDateStr: this.formatDate(weekEndDate)
		};
	}

	/**
	 * 获取学期的所有周次选项
	 * @param {Object} semester - 学期信息
	 * @returns {Array} 周次选项数组
	 */
	getWeekOptions(semester = null) {
		if (!semester) {
			semester = this.getCurrentSemester();
		}

		const options = [];
		for (let week = 1; week <= semester.weeks; week++) {
			const dateRange = this.getWeekDateRange(week, semester);
			const isExamWeek = semester.examWeeks.includes(week);
			const isHolidayWeek = semester.holidayWeeks.includes(week);

			let label = `第${week}周`;
			if (isExamWeek) {
				label += ' (考试周)';
			} else if (isHolidayWeek) {
				label += ' (假期)';
			}
			label += ` (${dateRange.startDateStr.slice(5)} - ${dateRange.endDateStr.slice(5)})`;

			options.push({
				value: week,
				label: label,
				isExamWeek,
				isHolidayWeek,
				dateRange
			});
		}

		return options;
	}

	/**
	 * 获取所有可用的学期选项
	 * @returns {Array} 学期选项数组
	 */
	getSemesterOptions() {
		const options = [];
		const currentDate = new Date();

		for (const [semesterKey, config] of Object.entries(this.semesterConfig)) {
			const startDate = new Date(config.startDate);
			const endDate = new Date(config.endDate);

			// 只显示当前日期前后一年内的学期
			const oneYearAgo = new Date(currentDate);
			oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
			const oneYearLater = new Date(currentDate);
			oneYearLater.setFullYear(currentDate.getFullYear() + 1);

			if (endDate >= oneYearAgo && startDate <= oneYearLater) {
				options.push({
					key: semesterKey,
					name: config.name,
					startDate: config.startDate,
					endDate: config.endDate,
					isCurrent: currentDate >= startDate && currentDate <= endDate
				});
			}
		}

		// 按开始日期排序，最新的在前面
		return options.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
	}

	/**
	 * 格式化日期
	 * @param {Date} date - 日期对象
	 * @returns {string} 格式化后的日期字符串
	 */
	formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	/**
	 * 格式化日期为显示格式
	 * @param {Date} date - 日期对象
	 * @returns {string} 格式化后的日期字符串
	 */
	formatDisplayDate(date) {
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${month}/${day}`;
	}

	/**
	 * 获取当前周的每一天日期
	 * @param {number} week - 周次
	 * @param {Object} semester - 学期信息
	 * @returns {Array} 一周七天的日期信息
	 */
	getWeekDays(week = null, semester = null) {
		if (!week) {
			const currentWeek = this.getCurrentWeek();
			week = currentWeek.week;
			semester = currentWeek.semester;
		}

		if (!semester) {
			semester = this.getCurrentSemester();
		}

		const dateRange = this.getWeekDateRange(week, semester);
		const startDate = dateRange.startDate;

		const days = [];
		const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

		for (let i = 0; i < 7; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);

			days.push({
				key: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i],
				name: dayNames[i],
				date: this.formatDisplayDate(date),
				fullDate: this.formatDate(date),
				dateObj: new Date(date)
			});
		}

		return days;
	}

	/**
	 * 检查是否需要更新周次信息
	 * @param {number} lastUpdateTime - 上次更新时间戳
	 * @returns {boolean} 是否需要更新
	 */
	shouldUpdateWeekInfo(lastUpdateTime) {
		const now = Date.now();
		const timeDiff = now - lastUpdateTime;

		// 如果超过5分钟或者跨越了周一0点，则需要更新
		const fiveMinutes = 5 * 60 * 1000;
		if (timeDiff > fiveMinutes) {
			return true;
		}

		// 检查是否跨越了周一0点
		const lastUpdate = new Date(lastUpdateTime);
		const current = new Date(now);

		// 如果日期不同，检查是否跨越了周一
		if (lastUpdate.getDate() !== current.getDate()) {
			const currentDayOfWeek = current.getDay();
			const lastDayOfWeek = lastUpdate.getDay();

			// 如果当前是周一，或者从周日跨越到了周一
			if (currentDayOfWeek === 1 || (lastDayOfWeek === 0 && currentDayOfWeek !== 0)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 获取缓存的周次信息
	 * @returns {Object|null} 缓存的周次信息
	 */
	getCachedWeekInfo() {
		try {
			const cached = uni.getStorageSync('cached_week_info');
			if (cached && cached.timestamp) {
				// 检查缓存是否需要更新
				if (!this.shouldUpdateWeekInfo(cached.timestamp)) {
					return cached.data;
				}
			}
			return null;
		} catch (e) {
			console.warn('获取缓存周次信息失败:', e);
			return null;
		}
	}

	/**
	 * 缓存周次信息
	 * @param {Object} weekInfo - 周次信息
	 */
	setCachedWeekInfo(weekInfo) {
		try {
			const cacheData = {
				data: weekInfo,
				timestamp: Date.now()
			};
			uni.setStorageSync('cached_week_info', cacheData);
		} catch (e) {
			console.warn('缓存周次信息失败:', e);
		}
	}

	/**
	 * 获取当前周次（带缓存）
	 * @param {Date} date - 指定日期，默认为当前日期
	 * @param {boolean} forceRefresh - 是否强制刷新
	 * @returns {Object} 周次信息
	 */
	getCurrentWeekCached(date = new Date(), forceRefresh = false) {
		// 如果不强制刷新，先尝试获取缓存
		if (!forceRefresh) {
			const cached = this.getCachedWeekInfo();
			if (cached) {
				return cached;
			}
		}

		// 计算最新的周次信息
		const weekInfo = this.getCurrentWeek(date);

		// 缓存结果
		this.setCachedWeekInfo(weekInfo);

		return weekInfo;
	}

	/**
	 * 验证周次计算的准确性
	 * @param {Date} testDate - 测试日期
	 * @returns {Object} 验证结果
	 */
	validateWeekCalculation(testDate = new Date()) {
		console.group('🔍 周次计算验证');

		const semester = this.getCurrentSemester(testDate);
		const weekInfo = this.getCurrentWeek(testDate);



		return {
			currentWeek: weekInfo.week,
			isValid: weekInfo.isValid,
			semester: semester
		};
	}


}

// 创建全局实例
const semesterCalculator = new SemesterCalculator();

export default semesterCalculator;
