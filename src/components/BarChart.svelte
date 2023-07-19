<script lang="ts">
    import { onMount } from 'svelte';
    import { Chart } from 'chart.js/auto';

    /**
   * @type {any[]}
   */
    export let chartData: any[];

    /**
   * @type {string[]}
   */
    let chartLabels: string[] = [];
    /**
   * @type {number[]}
   */
    let chartValues: number[] = [];
    let ctx: CanvasRenderingContext2D | null;
    /**
   * @type {HTMLCanvasElement}
   */
    let chartCanvas: HTMLCanvasElement;

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

    chartLabels = Object.keys(dataClassesCount);
    chartValues = Object.values(dataClassesCount);

    onMount(async () => {
        const context = chartCanvas.getContext('2d');
        if (!context) {
            console.error('Could not get 2D rendering context from canvas');
            return;
        }

        ctx = context;
        new Chart(ctx, {
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
        });
    });


</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>

