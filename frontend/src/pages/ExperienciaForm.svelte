<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';

  // Si recibe id edita; si no, crea
  let { id = null } = $props();

  let form = $state({
    name: '', description: '', regionId: '', cityId: '', categoryId: '',
    durationMinutes: '', price: '', active: true,
  });
  let regiones = $state([]);
  let ciudades = $state([]);
  let categorias = $state([]);
  let errores = $state({});
  let errorGeneral = $state('');
  let cargando = $state(true);
  let guardando = $state(false);

  async function cargarCiudades(regionId) {
    ciudades = regionId ? await api(`/regions/${regionId}/cities`) : [];
  }

  // Dropdown dependiente: al cambiar la region se vacian y se vuelven a pedir las ciudades
  async function alElegirRegion(regionId) {
    form.cityId = '';
    ciudades = [];
    errores.cityId = '';
    try {
      await cargarCiudades(regionId);
    } catch (e) {
      errorGeneral = e.message;
    }
  }

  onMount(async () => {
    try {
      [regiones, categorias] = await Promise.all([api('/regions'), api('/categories')]);
      if (id) {
        const exp = await api(`/experiences/${id}`);
        await cargarCiudades(exp.regionId); // primero las ciudades, luego el valor elegido
        Object.assign(form, exp);
      }
    } catch (e) {
      errorGeneral = e.message;
    } finally {
      cargando = false;
    }
  });

  async function guardar(e) {
    e.preventDefault();
    errores = {};
    errorGeneral = '';
    guardando = true;
    try {
      if (id) await api(`/experiences/${id}`, { method: 'PUT', body: form });
      else await api('/experiences', { method: 'POST', body: form });
      location.hash = '#/experiencias';
    } catch (err) {
      errores = err.fields || {};
      errorGeneral = err.message;
    } finally {
      guardando = false;
    }
  }
</script>

<h1>{id ? 'Editar experiencia' : 'Nueva experiencia'}</h1>

{#if cargando}
  <p class="estado">Cargando...</p>
{:else}
  <form class="form card" onsubmit={guardar}>
    {#if errorGeneral}<p class="alert" role="alert">{errorGeneral}</p>{/if}

    <label>Nombre
      <input type="text" bind:value={form.name} maxlength="80" required />
      {#if errores.name}<span class="field-error">{errores.name}</span>{/if}
    </label>

    <label>Descripción (opcional)
      <textarea rows="3" maxlength="300" bind:value={form.description}></textarea>
      {#if errores.description}<span class="field-error">{errores.description}</span>{/if}
    </label>

    <div class="grid-2">
      <label>Región
        <select bind:value={form.regionId} onchange={(e) => alElegirRegion(e.target.value)} required>
          <option value="">Elige una región</option>
          {#each regiones as r (r.id)}
            <option value={r.id}>{r.name}</option>
          {/each}
        </select>
        {#if errores.regionId}<span class="field-error">{errores.regionId}</span>{/if}
      </label>

      <label>Ciudad
        <select bind:value={form.cityId} disabled={ciudades.length === 0} required>
          <option value="">{form.regionId ? 'Elige una ciudad' : 'Primero elige una región'}</option>
          {#each ciudades as c (c.id)}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
        {#if errores.cityId}<span class="field-error">{errores.cityId}</span>{/if}
      </label>
    </div>

    <label>Categoría
      <select bind:value={form.categoryId} required>
        <option value="">Elige una categoría</option>
        {#each categorias as c (c.id)}
          <option value={c.id}>{c.name}</option>
        {/each}
      </select>
      {#if errores.categoryId}<span class="field-error">{errores.categoryId}</span>{/if}
    </label>

    <div class="grid-2">
      <label>Duración en minutos (de 15 en 15)
        <input type="number" bind:value={form.durationMinutes} min="15" max="720" step="15" required />
        {#if errores.durationMinutes}<span class="field-error">{errores.durationMinutes}</span>{/if}
      </label>
      <label>Precio por persona (USD)
        <input type="text" inputmode="decimal" bind:value={form.price} required />
        {#if errores.price}<span class="field-error">{errores.price}</span>{/if}
      </label>
    </div>

    <label class="check">
      <input type="checkbox" bind:checked={form.active} /> Activa (visible para los turistas)
    </label>

    <div class="actions">
      <button class="btn" type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar experiencia'}</button>
      <a class="btn btn--ghost" href="#/experiencias">Cancelar</a>
    </div>
  </form>
{/if}
