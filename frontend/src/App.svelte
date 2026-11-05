<script>
  import { auth, cargarSesion, cerrarSesion } from './lib/auth.svelte.js';
  import Login from './pages/Login.svelte';
  import Experiencias from './pages/Experiencias.svelte';
  import ExperienciaForm from './pages/ExperienciaForm.svelte';
  import Ciudades from './pages/Ciudades.svelte';

  // Router por hash: la ruta es lo que va después del #
  let ruta = $state(location.hash.slice(1) || '/experiencias');
  let idEditar = $derived(ruta.match(/^\/experiencias\/(\d+)\/editar$/)?.[1]);

  $effect(() => {
    const alCambiarHash = () => (ruta = location.hash.slice(1) || '/experiencias');
    window.addEventListener('hashchange', alCambiarHash);
    cargarSesion();
    return () => window.removeEventListener('hashchange', alCambiarHash);
  });

  // Guard de interfaz. La seguridad real es el 401 que devuelve el backend.
  $effect(() => {
    if (auth.loading) return;
    if (!auth.admin && ruta !== '/login') location.hash = '#/login';
    else if (auth.admin && ruta === '/login') location.hash = '#/experiencias';
  });
</script>

{#if auth.loading}
  <p class="estado estado--centro">Cargando...</p>
{:else if !auth.admin}
  <Login />
{:else}
  <div class="shell">
    <aside class="side">
      <a class="side__brand" href="#/experiencias"><img class="side__mapa" src="/ecuador.svg" alt="" /><span>Rutea<br />EC</span></a>
      <nav class="side__nav" aria-label="Principal">
        <a href="#/experiencias" class:activo={ruta.startsWith('/experiencias')}>Experiencias</a>
        <a href="#/ciudades" class:activo={ruta.startsWith('/ciudades')}>Ciudades</a>
      </nav>
      <div class="side__user">
        <span class="side__email">{auth.admin.email}</span>
        <button class="btn btn--ghost" onclick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </aside>

    <main class="content">
      {#if ruta === '/experiencias'}
        <Experiencias />
      {:else if ruta === '/experiencias/nueva'}
        <ExperienciaForm />
      {:else if idEditar}
        {#key idEditar}
          <ExperienciaForm id={Number(idEditar)} />
        {/key}
      {:else if ruta === '/ciudades'}
        <Ciudades />
      {:else}
        <h1>Página no encontrada</h1>
        <p><a href="#/experiencias">Volver a experiencias</a></p>
      {/if}
    </main>
  </div>
{/if}
