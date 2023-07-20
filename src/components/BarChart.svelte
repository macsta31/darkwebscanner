<script lang="ts">
    import { afterUpdate, onMount, onDestroy } from 'svelte';
    import { Chart, type ChartConfiguration } from 'chart.js/auto';

    /**
     * @type {any[]}
     */
    export let chartData: any[];

    /**
     * @type {HTMLCanvasElement}
     */
    let chartCanvas: HTMLCanvasElement;

    let chartInstance: Chart | null = null;

    const updateChart = () => {
        // Prepare data for the chart
        const dataClassesCount: Record<string, number> = {};

        chartData.forEach((item: any) => {
            item.Breach.dataClasses.forEach((dataClass: string) => {
                if (!dataClassesCount[dataClass]) {
                    dataClassesCount[dataClass] = 1;
                } else {
                    dataClassesCount[dataClass]++;
                }
            });
        });

        const chartLabels = Object.keys(dataClassesCount);
        const chartValues = Object.values(dataClassesCount);

        // Chart configuration
        const config: ChartConfiguration = {
            type: 'bar', 
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Number of occurrences',
                    backgroundColor: '#2334C6',
                    borderColor: '#2334C6',
                    data: chartValues,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Occurrence of Data Classes',
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
                        title: {
                            display: true,
                            text: 'Occurrence Count',
                            color: 'white' // Color of x-axis title
                        },
                        ticks: {
                            color: 'white' // Color of x-axis labels
                        },
                        beginAtZero: true // Start the x-axis at zero
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Data Classes',
                            color: 'white' // Color of y-axis title
                        },
                        ticks: {
                            color: 'white' // Color of y-axis labels
                        }
                    }
                },
                // Add a fixed maximum width with scrolling
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 10
                    }
                },
                maintainAspectRatio: false,
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
