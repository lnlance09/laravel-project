const backgroundColor = "#fff"
const textColor = "#ccc"
const secDay = 3600 * 24

const initialState = {
    coin: {
        category: "",
        description: "",
        id: 0,
        logo: "",
        marketCap: 0,
        maxSupply: 0,
        name: "",
        slug: "",
        symbol: "",
        totalSupply: 0
    },
    includeRanges: true,
    options: {
        chart: {
            backgroundColor,
            plotBackgroundColor: null,
            plotShadow: false,
            plotBorderWidth: 0,
            style: {
                fontFamily: "Noto Sans, Segoe UI, Helvetica, sans-serif"
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
            numericSymbols: null //otherwise by default ['k', 'M', 'G', 'T', 'P', 'E']
        },
        legend: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        plotOptions: {
            area: {},
            line: {
                animation: false,
                marker: {
                    enabled: false,
                    lineColor: "#333"
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
            pointFormat: `<span style="color:{series.color}">●</span> {point.y:.0f} {series.name}<br>`,
            xDateFormat: "%a, %Y-%m-%d %H:%M"
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
            title: {
                text: null
            },
            type: "datetime"
        },
        yAxis: {
            alternateGridColor: null,
            crosshair: true,
            gridLineColor: "rgba(255, 255, 255, .1)",
            index: 0,
            minorGridLineColor: "rgba(255,255,255,0.07)",
            minorTickInterval: null,
            labels: {
                enabled: true
            },
            lineWidth: 0,
            opposite: false,
            tickWidth: 0,
            showLastLabel: false,
            type: "logarithmic",
            title: {
                text: null
            }
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
