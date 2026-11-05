<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { claseRegion } from '../lib/regions.js';

  // La barra de duración se mide contra 8 horas (480 min)
  const TOPE_MIN = 480;

  let experiencias = $state([]);
  let cargando = $state(true);
  let error = $state('');

  async function cargar() {
    try {
      experiencias = await api('/experiences');
    } catch (e) {
      error = e.message;
    } finally {
      cargando = false;
    }
  }

  async function borrar(exp) {
    if (!confirm(`¿Borrar "${exp.name}"?`)) return;
    try {
      await api(`/experiences/${exp.id}`, { method: 'DELETE' });
      experiencias = experiencias.filter((x) => x.id !== exp.id);
    } catch (e) {
      error = e.message;
    }
  }

  onMount(cargar);
</script>

<div class="bar">
  <div>
    <h1>Experiencias</h1>
    {#if !cargando}<p class="sub">{experiencias.length} {experiencias.length === 1 ? 'experiencia cargada' : 'experiencias cargadas'}</p>{/if}
  </div>
  <a class="btn" href="#/experiencias/nueva">Nueva experiencia</a>
</div>

{#if error}<p class="alert" role="alert">{error}</p>{/if}

{#if cargando}
  <p class="estado">Cargando experiencias...</p>
{:else if experiencias.length === 0}
  <p class="estado">Todavía no hay experiencias. Crea la primera con "Nueva experiencia".</p>
{:else}
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Experiencia</th><th>Ciudad</th><th>Categoría</th><th>Duración</th><th class="num">Precio</th><th>Estado</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        {#each experiencias as e (e.id)}
          <tr>
            <td class="nombre">{e.name}</td>
            <td>
              <span class="tag {claseRegion(e.region)}">{e.region}</span>
              <span class="ciudad">{e.city}</span>
            </td>
            <td>{e.category}</td>
            <td>
              <div class="duracion" title="{e.duration_minutes} minutos">
                <span class="duracion__barra"><span class="duracion__relleno {claseRegion(e.region)}" style="width: {Math.min(100, (e.duration_minutes / TOPE_MIN) * 100)}%"></span></span>
                <span class="duracion__texto">{e.duration_minutes} min</span>
              </div>
            </td>
            <td class="num">${Number(e.price).toFixed(2)}</td>
            <td>{e.active ? 'Activa' : 'Oculta'}</td>
            <td class="actions">
              <a class="btn btn--ghost" href="#/experiencias/{e.id}/editar">Editar</a>
              <button class="btn btn--danger" onclick={() => borrar(e)}>Borrar</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
