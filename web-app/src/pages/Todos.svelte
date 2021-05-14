<script>
  import TodoItem from './TodoItem.svelte'
  import { db } from '../firebase'
import { onDestroy } from 'svelte';
  export let uid
  let text = 'some task'
  const query = db
    .collection('todos')
    .where('uid', '==', uid)
    .orderBy('text')
  let todos = []
  const unsubscribe = query.onSnapshot(next => {
    next.docChanges().forEach(v => todos = [...todos, v.doc.data()])
  })
  onDestroy(() => unsubscribe())
  function add() {
    db.collection('todos').add({
      uid,
      text,
      complete: false,
      created: Date.now(),
    })
    text = ''
  }
  function updateStatus(event) {
    console.log(event)
    const { id, newStatus } = event.detail
    db.collection('todos').doc(id).update({ complete: newStatus })
  }
  function removeItem(event) {
    const { id } = event.detail
    db.collection('todos').doc(id).delete()
  }
</script>

<ul>
  {#each todos as todo}
    <TodoItem {...todo} on:remove={removeItem} on:toggle={updateStatus} />
  {/each}
</ul>

<input bind:value={text} />

<hr />

<p>Your task: <strong>{text}</strong></p>

<button class="button is-info" on:click={add}>Add Task</button>

<style>
  input {
    display: block;
  }
</style>
