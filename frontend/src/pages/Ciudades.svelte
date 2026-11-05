<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { claseRegion } from '../lib/regions.js';

  let ciudades = $state([]);
  let regiones = $state([]);
  let form = $state({ name: '', regionId: '' });
  let errores = $state({});
  let error = $state('');
  let cargando = $state(true);

  async function cargar() {
    ciudades = await api('/cities');
  }

  onMount(async () => {
    try {
      [regiones] = await Promise.all([api('/regions'), cargar()]);
    } catch (e) {
      error = e.message;
    } finally {
      cargando = false;
    }
  });

  async function crear(e) {
    e.preventDefault();
    errores = {};
    error = '';
    try {
      await api('/cities', { method: 'POST', body: form });
      form.name = '';
      await cargar();
    } catch (err) {
      errores = err.fields || {};
      error = err.message;
    }
  }

  async function borrar(c) {
    if (!confirm(`¿Borrar la ciudad "${c.name}"?`)) return;
    error = '';
    try {
      await api(`/cities/${c.id}`, { method: 'DELETE' });
      await cargar();
    } catch (err) {
      error = err.message;
    }
  }
</script>

<h1>Ciudades</h1>

{#if error}<p class="alert" role="alert">{error}</p>{/if}

<form class="form card" onsubmit={crear}>
  <div class="grid-2">
    <label>Nombre de la ciudad
      <input type="text" bind:value={form.name} maxlength="60" required />
      {#if errores.name}<span class="field-error">{errores.name}</span>{/if}
    </label>
    <label>Región
      <select bind:value={form.regionId} required>
        <option value="">Elige una región</option>
        {#each regiones as r (r.id)}
          <option value={r.id}>{r.name}</option>
        {/each}
      </select>
      {#if errores.regionId}<span class="field-error">{errores.regionId}</span>{/if}
    </label>
  </div>
  <div class="actions"><button class="btn" type="submit">Agregar ciudad</button></div>
</form>

{#if cargando}
  <p class="estado">Cargando ciudades...</p>
{:else}
  <div class="table-wrap">
    <table>
      <thead><tr><th>Ciudad</th><th>Región</th><th>Experiencias</th><th>Acciones</th></tr></thead>
      <tbody>
        {#each ciudades as c (c.id)}
          <tr>
            <td class="nombre">{c.name}</td><td><span class="tag {claseRegion(c.region)}">{c.region}</span></td><td>{c.experiences}</td>
            <td class="actions"><button class="btn btn--danger" onclick={() => borrar(c)}>Borrar</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
