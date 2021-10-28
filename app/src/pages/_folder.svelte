<script lang="ts">
  import { user, idEmpresa, empresa } from '../code/store'
  import Ajuda from '../components/Ajuda.svelte'
  import Cadastro from '../parts-folder/Cadastro.svelte'
  import Escolha from '../parts-folder/Escolha.svelte'
</script>

<main class="container">
  {#if $user && idEmpresa && $empresa}
    <slot />
  {:else if $user && idEmpresa}
    Carregando dados da empresa...
  {:else if $user}
    <h1>Bem vindo ao NFe Fácil</h1>
    <Escolha />
    <Cadastro />
  {:else if $user === null}
    <h1>Bem vindo ao NFe Fácil</h1>
    <button on:click={user.signIn}>Iniciar sessão</button>
  {:else}
    Aguardando serviço de autenticação...
  {/if}
  {#if ($user && !idEmpresa) || $user === null}
    <Ajuda>
      <p>
        Esta é a tela inicial da aplicação. Aqui você pode fazer 3 atividades
        diferentes:
      </p>
      <ol>
        <li>
          Login com sua conta Google: ela será atrelada às empresas que você
          cadastrar e às empresas que você solicitar cadastro usando o seu ID
          único de usuário.
        </li>
        <li>
          Cadastrar nova empresa: caso este seja o primeiro cadastro da empresa,
          o certificado fornecido será validado e, caso ele seja aceito, um novo
          registro de empresa será gravado no servidor, seu registro de usuário
          será registrado como administrador da empresa e você será encaminhado
          pra tela principal da aplicação, onde será necessário que você
          preencha os dados de emitente em "Atualizar dados empresa" e o seu
          token do IBPT na tela "Configurar emissão". Caso a empresa já esteja
          cadastrada, após seu certificado ser validado, você será registrado
          como administrador e já poderá fazer as operações desejadas na tela
          principal da aplicação.
        </li>
        <li>
          Escolher emitente: esta é uma função útil para aqueles que são donos
          de mais de um CNPJ. Aqui são exibidos todos os CNPJs atrelados a este
          registro de usuário e com isso é possível você escolher em qual
          empresa você deseja operar agora.
        </li>
      </ol>
      <p>
        Mais informações referentes à contrução da aplicação e próximas etapas
        poderão ser encontradas no site principal da aplicação que ainda está em
        construção.
      </p>
    </Ajuda>
  {/if}
</main>
<footer class="destacado">
  Entrar em contato via:
  <br />
  <a href="https://wa.me/5583988856440" title="WhatsApp" target="_blank">
    <img src="icons/iconmonstr-whatsapp-4.svg" alt="Símbolo do WhatsApp" />
  </a>
  <a href="https://t.me/Jaedson33" title="Telegram" target="_blank">
    <img src="icons/iconmonstr-telegram-4.svg" alt="Símbolo do Telegram" />
  </a>
  <a
    href="https://twitter.com/messages/compose?recipient_id=1262825502198452225"
    title="Twitter"
    target="_blank"
  >
    <img src="icons/iconmonstr-twitter-4.svg" alt="Símbolo do Twitter" />
  </a>
  <a href="mailto:jaedson33@gmail.com" title="E-mail">
    <img src="icons/iconmonstr-email-10.svg" alt="Símbolo de email" />
  </a>
</footer>

<style>
  main {
    margin-top: 2rem;
    min-height: 100vh;
  }

  img {
    display: inline-block;
    height: 2em;
  }

  footer {
    text-align: center;
    margin-top: 4rem;
    padding: 2rem;
  }
</style>
