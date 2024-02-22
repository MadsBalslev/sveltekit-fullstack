<script lang="ts">
  import { enhance } from "$app/forms"
</script>

<h1>Sign Up!</h1>
<form method="post" use:enhance>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <label for="password">Password</label>
  <input type="password" id="password" name="password" required />
  <button>Sign Up!</button>
</form>
