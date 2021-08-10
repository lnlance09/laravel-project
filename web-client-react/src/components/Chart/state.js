const areaColor = "#4834d4"
const backgroundColor = "#fff"
const textColor = "#ccc"
const secDay = 3600 * 24

const initialState = {
	options: {
		chart: {
			backgroundColor,
			height: 250,
			plotBackgroundColor: null,
			plotShadow: false,
			plotBorderWidth: 0,
			style: {
				fontFamily: "Overpass, Segoe UI, Helvetica, sans-serif"
			},
			type: "area"
		},
		credits: {
			enabled: false
		},
		labels: {
			style: {
				color: textColor
			}
		},
		lang: {
			numericSymbols: null // otherwise by default ['k', 'M', 'G', 'T', 'P', 'E']
		},
		legend: {
			enabled: false
		},
		navigator: {
			enabled: false
		},
		plotOptions: {
			area: {
				animation: false,
				color: areaColor,
				crisp: false
			},
			line: {
				animation: false,
				marker: {
					enabled: false,
					lineColor: areaColor
				}
			}
		},
		rangeSelector: {
			enabled: false
		},
		scrollbar: {
			enabled: false
		},
		series: [
			{
				data: [],
				turboThreshold: 2000
			}
		],
		subtitle: false,
		textColor,
		title: false,
		tooltip: {
			backgroundColor: "#050505",
			borderColor: "rgba(255, 255, 255, 0.1)",
			crosshairs: true,
			pointFormat:
				// eslint-disable-next-line
				"<span style='color: #fff; display: block; font-size: 16px; padding-top: 1em;'>${point.y:.3f}<span><br>",
			positioner: function () {
				return { x: 0, y: 0 }
			},
			style: {
				fontSize: "16px"
			},
			useHtml: true,
			xDateFormat: "<span style='color: #fff; font-size: 14px;'>%a, %b %e %l:%M %p</span>"
		},
		xAxis: {
			categories: null,
			index: 0,
			isX: true,
			labels: {
				enabled: true,
				format: "{value:%a %H:%M}",
				overflow: "justify"
			},
			maxPadding: 0,
			minPadding: 0,
			ordinal: true,
			showLastLabel: true,
			tickWidth: 0,
			title: {
				text: null
			},
			type: "datetime",
			visible: false
		},
		yAxis: {
			alternateGridColor: null,
			crosshair: false,
			gridLineColor: "rgba(255, 255, 255, .1)",
			index: 0,
			minorGridLineColor: "rgba(255, 255, 255, 0.07)",
			minorTickInterval: null,
			labels: {
				enabled: true
			},
			lineWidth: 0,
			opposite: false,
			tickWidth: 0,
			showLastLabel: false,
			title: {
				text: null
			},
			type: "logarithmic",
			visible: false
		}
	},
	timeframes: [
		{
			name: "1D",
			period: 900,
			start: Math.round(new Date().getTime() / 1000 - secDay)
		},
		{
			name: "7D",
			period: 900,
			start: Math.round(new Date().getTime() / 1000 - secDay * 7)
		},
		{
			name: "1M",
			period: 14400,
			start: Math.round(new Date().getTime() / 1000 - secDay * 30)
		},
		{
			name: "3M",
			period: 14400,
			start: Math.round(new Date().getTime() / 1000 - secDay * 90)
		},
		{
			name: "1Y",
			period: 86400,
			start: Math.round(new Date().getTime() / 1000 - secDay * 365)
		},
		{
			name: "ALL",
			period: 86400,
			start: Math.round(new Date().getTime() / 1000 - secDay * 365 * 12)
		}
	]
}

export default initialState
