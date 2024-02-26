<script lang="ts">
	import type { PageData } from "./$types";
  import { Github } from 'lucide-svelte'
  import { Button } from "$lib/components/ui/button";
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import AlertCircle from "lucide-svelte/icons/alert-circle";
  import { Input } from "$lib/components/ui/input";
  import { signUpSchema, type SignUpSchema } from "$lib/schemas";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data: PageData;
  let lginForm: SuperValidated<Infer<SignUpSchema>> = data.form

  const form = superForm(lginForm, {
    validators: zodClient(signUpSchema),
  });

  const { form: formData, enhance, message } = form;
</script>

{#if $message}
<Alert.Root variant="destructive">
  <AlertCircle class="h-4 w-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>{$message}</Alert.Description>
</Alert.Root>
{/if}
<form method="POST" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control let:attrs>
      <Form.Label>Email</Form.Label>
      <Input {...attrs} bind:value={$formData.email} type="email" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password">
    <Form.Control let:attrs>
      <Form.Label>Password</Form.Label>
      <Input {...attrs} bind:value={$formData.password} type="password" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="confirmPassword">
    <Form.Control let:attrs>
      <Form.Label>Confirm Password</Form.Label>
      <Input {...attrs} bind:value={$formData.confirmPassword} type="password" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button class="w-full">Signup</Form.Button>
</form>

<div class="seperator">
  <span>or</span>
</div>

<Button variant="secondary" class="w-full">
  <Github class="mr-2 h-4 w-4" />
  Signup with GitHub
</Button>

<style>
  .seperator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }

  .seperator span {
    background-color: #fff;
    padding: 0 1rem;
  }

  .seperator::before, .seperator::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: #d1d5db;
  }
</style>

