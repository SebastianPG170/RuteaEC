<script>
  import { iniciarSesion } from '../lib/auth.svelte.js';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let enviando = $state(false);

  async function enviar(e) {
    e.preventDefault();
    error = '';
    enviando = true;
    try {
      await iniciarSesion(email, password);
      location.hash = '#/experiencias';
    } catch (err) {
      error = err.message;
    } finally {
      enviando = false;
    }
  }
</script>

<div class="login">
  <div class="login__marca">
    <p class="login__nombre">Rutea<br />EC</p>
    <p class="login__texto">Administración de las experiencias que alimentan los planes de viaje.</p>
    <div class="login__franja" aria-hidden="true">
      <span class="franja franja--amarillo"></span>
      <span class="franja franja--azul"></span>
      <span class="franja franja--rojo"></span>
    </div>
    <img class="login__mapa" src="/ecuador.svg" alt="Mapa de Ecuador" />
  </div>

  <section class="login__form card">
    <h1>Ingresar</h1>
    {#if error}<p class="alert" role="alert">{error}</p>{/if}
    <form class="form" onsubmit={enviar}>
      <label>Correo
        <input type="email" bind:value={email} required autocomplete="username" />
      </label>
      <label>Clave
        <input type="password" bind:value={password} required autocomplete="current-password" />
      </label>
      <button class="btn" type="submit" disabled={enviando}>{enviando ? 'Ingresando...' : 'Ingresar'}</button>
    </form>
  </section>
</div>
