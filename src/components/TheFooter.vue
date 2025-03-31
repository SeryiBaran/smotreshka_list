<template>
  <div class="dark:border-brand-300/50 border-brand-500 mt-4 pt-4 text-center border-t-1">
    <div class="i-carbon-campsite text-5xl inline-block" />
    <p>
      <a rel="noreferrer" href="https://github.com/antfu-collective/vitesse-lite" target="_blank">
        Vitesse Lite
      </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Vite Starter Template</em>
    </p>
    <nav text-xl mt-6 inline-flex gap-2>
      <button icon-btn @click="toggleDark()">
        <div i-carbon-sun dark:i-carbon-moon />
      </button>

      <a
        i-carbon-logo-github icon-btn
        rel="noreferrer"
        href="https://github.com/antfu-collective/vitesse-lite"
        target="_blank"
        title="GitHub"
      />
    </nav>
  </div>
</template>
