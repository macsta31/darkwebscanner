<script lang="ts">
    import { afterUpdate, onMount, onDestroy } from 'svelte';
    import { Chart, type ChartConfiguration } from 'chart.js/auto';
    import 'chartjs-adapter-date-fns';
    import { enUS } from 'date-fns/locale';
    import { startOfMonth, format, addMonths } from 'date-fns';

    export let chartData: any[];

    let chartCounts: { [key: string]: number } = {};
    let chartCanvas: HTMLCanvasElement;
    let chartInstance: Chart | null = null;

    const updateChart = () => {
        // Prepare data for the chart
        chartCounts = {};
        chartData.forEach(item => {
            const date = startOfMonth(new Date(item.Breach.BreachDate));
            const key = format(date, 'yyyy-MM', { locale: enUS });
            
            if (!chartCounts[key]) {
                chartCounts[key] = 0;
            }
            chartCounts[key] += 1;  // Count each breach as 1
        });

        const sortedKeys = Object.keys(chartCounts).sort();
        const sortedValues = sortedKeys.map(key => chartCounts[key]);
        const accumulatedCounts = sortedValues.reduce((acc, value) => {
            acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + value);
            return acc;
        }, [] as number[]);

        const start = new Date(sortedKeys[0]);
        const end = new Date(sortedKeys[sortedKeys.length - 1]);

        let pointer = start;
        while (pointer <= end) {
            const pointerKey = format(pointer, 'yyyy-MM', { locale: enUS });
            if (!chartCounts[pointerKey]) {
                chartCounts[pointerKey] = 0;
            }
            pointer = addMonths(pointer, 1);
        }

        const finalKeys = Object.keys(chartCounts).sort();
        const finalValues = finalKeys.map(key => chartCounts[key]);
        const finalAccumulatedCounts = finalValues.reduce((acc, value) => {
            acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + value);
            return acc;
        }, [] as number[]);

        // Chart configuration
        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels: finalKeys,
                datasets: [{
                    label: 'Total Number of Leaks',
                    backgroundColor: '#2334C6',
                    borderColor: '#2334C6',
                    data: finalAccumulatedCounts,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: false
                    },
                    
                },
                
                plugins: {
                    title: {
                        display: true,
                        text: 'Data Leaks Over Time',
                        color: 'white' // Color of chart title
                    },
                    legend: {
                        labels: {
                            color: 'white' // Color of labels
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'timeseries',
                        time: {
                            unit: 'month'
                        },
                        adapters: {
                            date: {
                                locale: enUS,
                            }
                        },
                        ticks: {
                            color: 'white' // Color of x-axis labels
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total Number of Leaks',
                            color: 'white' // Color of y-axis title
                        },
                        ticks: {
                            color: 'white' // Color of y-axis labels
                        }
                    }
                },
            }
        };

        if (chartInstance) {
            chartInstance.destroy();
        }

        const context = chartCanvas.getContext('2d');
        if (!context) {
            console.error('Could not get 2D rendering context from canvas');
            return;
        }

        chartInstance = new Chart(context, config);
    };

    onMount(() => {
        updateChart();
    });

    afterUpdate(() => {
        updateChart();
    });

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });

</script>

<canvas bind:this={chartCanvas} class="myChart" style="height: 250px; width: 100%;"></canvas>
