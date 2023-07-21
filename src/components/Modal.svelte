<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    function closeModal() {
      dispatch('close');
    }
  </script>
  
  <div class="modal-background" on:click={closeModal}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <slot></slot>
    </div>
  </div>
  
  <style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 1em;
    border-radius: 0.3em;
    min-width: 500px;
  }
  </style>
  