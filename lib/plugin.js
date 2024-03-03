export default function ({ app: { router } }, inject) {
  if (<%= options.skipAll %>) {
    // inject empty gtag function for disabled mode
    inject('gtag', () => { })
    return
  }

  window.dataLayer = window.dataLayer || []

  function gtag() {
    dataLayer.push(arguments)

    if (<%= options.debug %>) {
      console.debug('gtag tracking called with following arguments:', arguments)
    }
  }

  inject('gtag', gtag)
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
  });
  gtag('js', new Date())
  gtag('config', '<%= options.id %>', <%= JSON.stringify(options.config, null, 2) %>)

  if (!<%= options.disableAutoPageTrack %>) {
    router.afterEach((to) => {
      gtag('config', '<%= options.id %>', { 'page_path': to.fullPath, 'location_path': window.location.origin + to.fullPath })
    })
  }

  // additional accounts
  <% Array.isArray(options.additionalAccounts) && options.additionalAccounts.forEach((account) => { %>
    gtag('config', '<%= account.id %>', <%= JSON.stringify(account.config, null, 2) %>)
    <% }) %>
}
