<script lang="ts">
    import { fly } from "svelte/transition";
    import { cubicIn } from "svelte/easing";
    import { onMount } from "svelte";
  
    export let animate = false;
    let emojis: any[] = [];
    const emojiList = ["🎉", "😀", "✨"]; // List of emojis to choose from
  
    $: if (animate) {
      emojis = [];
      for (let i = 0; i < 100; i++) {
        const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        emojis.push({
          id: i,
          emoji: randomEmoji,
          left: Math.random() * window.innerWidth,
          duration: Math.random() * 500 + 3000,
          delay: Math.random() * 0.5 // Random delay up to 1 second
        });
      }
    } else {
      emojis = [];
    }
  
    onMount(() => {
      if (animate) {
        animate = false;
      }
    });
</script>

<style>
    .emoji {
        font-size: 6rem; /* Increase the size of emojis */
        position: absolute;
        top: 0;
    }
</style>

{#each emojis as emoji (emoji.id)}
    <span 
      class="emoji"
      transition:fly="{{ y: window.innerHeight, duration: emoji.duration, delay: emoji.delay * 1000, easing: cubicIn }}"
      style="left: {emoji.left}px;" 
      role="img" 
      aria-label="emoji"
    >
      {emoji.emoji} <!-- Display the emoji from the emoji object -->
    </span>
{/each}
