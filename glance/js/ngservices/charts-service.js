function buildCharts(monitor) {
    function initMarkline(color) {
        var data = {};
        data = {
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: color,
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            symbolSize: '<2|4>'
        };
        return data;
    }

    function initMarklineData(frequency, alarmingRate) {
        var data = [];
        while(frequency >= 0) {
            data.push(alarmingRate);
            frequency = frequency -1;
        }
        return data;
    }

    function createMarkline(frequency, alarmingRate, color) {
        var markLine = initMarkline(color);
        markLine.data = initMarklineData(frequency, alarmingRate);
        return markLine;
    }

    function setBasicStyle(color) {
        var option = {
            grid: {},
            xAxis: [],
            yAxis: [],
            animation: false
        };
        option.grid.borderWidth = 0;
        option.xAxis[0] = {
            type: 'category',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: color
                }
            }
        };
        option.yAxis[0] = {
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: color
                }
            },
            min: 0,
            max: 100
        };
        return option;
    }

    function setBasicInfo(descriptions) {
        var option = {
            title: {
                text: descriptions.title,
                subtext: descriptions.subtitle
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params){
                    var res = '';
                    for (var i = 0, l = params.length; i < l; i++) {
                        if(params[i].seriesName === 'CPU使用率'){
                            res += params[i].seriesName + ':' + params[i].data + '%' + '<br/>'
                        }else if(params[i].seriesName === '内存使用率'){
                            res += params[i].seriesName + ':' + params[i].data + '%' + '<br/>'
                        }else if(params[i].seriesName === '磁盘使用率'){
                            res += params[i].seriesName + ':' + params[i].data + '%' + '<br/>'
                        }
                    }
                    return res;
                }
            }
        };
        return option;
    }

    function setSeriesStyles(indicator) {
        var seriesStyle = {
            name: indicator.descriptions.seriesName,
            type: 'line',
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: indicator.styles.lineWidth
                    }
                }
            },
            symbolSize: '<2|4>'
        };
        if (indicator.styles.lineColor) {
            seriesStyle.itemStyle.normal.lineStyle.color = indicator.styles.lineColor;
        }
        return seriesStyle;
    }

    function getCpuSeriesData(data) {
        var cpuSeriesData = [];
        var cpuNumber = data[0].length;
        for (var i = 0; i < cpuNumber; i++) {
            cpuSeriesData[i] = [];
            for (var j = 0; j < data.length; j++) {
                if (data[j] && data[j][i]) {
                    cpuSeriesData[i][j] = Number(data[j][i]).toFixed(2);
                } else {
                    cpuSeriesData[i][j] = '0.00';
                }
            }
        }
        return cpuSeriesData;
    }

    function getMemoryDiskSeriesData(data) {
        var seriesData = [];
        $.each(data, function(index, val) {
            seriesData[index] = val? val : '0.00';
        });
        return seriesData;
    }

    function getChatrsOption(indicator, xAxis, yAxis, alarmingLines) {
        var option = {};
        option.series = [];
        var basicStyle = setBasicStyle(indicator.styles.axesColor);
        basicStyle.xAxis[0].data = xAxis;
        var basicInfo = setBasicInfo(indicator.descriptions);
        
        var keys = [basicStyle, basicInfo];
        $.each(keys, function(index, obj) {
            $.each(obj, function(key, value) {
                option[key] = value;
            });
        });

        var seriesStyle = setSeriesStyles(indicator);
        var seriesData = (indicator.key === 'cpu') ? getCpuSeriesData(yAxis) : getMemoryDiskSeriesData(yAxis);
        var lineNumber = 1;
        if ($.isArray(seriesData[0])) {
            lineNumber = seriesData.length;
            for (var i = 0; i < lineNumber; i++) {
                option.series[i] = seriesStyle;
                option.series[i].data = seriesData[i];
            }
        } else {
            option.series[0] = seriesStyle;
            option.series[0].data = seriesData
        }
        option.series[lineNumber] = createMarkline(alarmingLines.frequency, alarmingLines.high.rate, alarmingLines.high.color);
        option.series[lineNumber+1] = createMarkline(alarmingLines.frequency, alarmingLines.low.rate, alarmingLines.low.color);
        return option;
    }

    function initCharts(indicator, xAxis, yAxis, alarmingLines) {
        var option = getChatrsOption(indicator, xAxis, yAxis, alarmingLines);
        var chart = echarts.init(document.getElementById(indicator.domId));
        chart.setOption(option);
    }

    var lineCharts = function(chartsData, DOMs, kind) {
        var cpu = {
            key: 'cpu',
            domId: DOMs.cpu,
            descriptions: {
                title: 'CPU监控',
                subtitle: '一小时内变化',
                seriesName: 'CPU使用率'
            },
            styles: {
                lineWidth: 2,
                axesColor: '#9B9B9B',
                axiesFontsize: '11px'
            }
        };
        var memory = {
            key: 'memory',
            domId: DOMs.memory,
            descriptions: {
                title: '内存监控',
                subtitle: '一小时内变化',
                seriesName: '内存使用率'
            },
            styles: {
                lineColor: '#B6A2DC',
                lineWidth: 2,
                axesColor: '#9B9B9B',
                axiesFontsize: '11px'
            }
        };
        var disk = {
            key: 'disk',
            domId: DOMs.disk,
            descriptions: {
                title: '磁盘监控',
                subtitle: '一小时内变化',
                seriesName: '磁盘使用率'
            },
            styles: {
                lineColor: '#B6A2DC',
                lineWidth: 2,
                axesColor: '#9B9B9B',
                axiesFontsize: '11px'
            }
        };
        var xAxis;
        var yAxis;
        if (chartsData) {
            xAxis = chartsData.xAxis;
            yAxis = chartsData.yAxis;
        } else {
            var defaultData = monitor.getDefaultData();
            yAxis = defaultData.yAxis;
            xAxis = defaultData.xAxis;
        }

        var cpuNumber = 1;
        if ($.isArray(yAxis.cpu[0])) {
            cpuNumber = yAxis.cpu[0].length;
        }

        var alarmingLines = {
            frequency: 60,
            high: {
                rate: 80,
                color: 'rgba(208, 2, 27, 0.5)'
            },
            low: {
                rate: 40,
                color: 'rgba(245, 166, 35, 0.5)'
            }
        };

        initCharts(memory, xAxis, yAxis.memory, alarmingLines);
        initCharts(disk, xAxis, yAxis.disk, alarmingLines);
        initCharts(cpu, xAxis, yAxis.cpu, alarmingLines);
    };

    return {
        lineCharts: lineCharts
    };
}

buildCharts.$inject = ["monitor"];
glanceApp.factory('buildCharts', buildCharts);