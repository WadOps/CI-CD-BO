// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'login tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.card')
      .pause(1000)
      .click('button[type=submit]')
      .waitForElementVisible('.snack__wrapper', 5000)
      .end()
  },

  'after auth tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL
    

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.card')
      .pause(1000)
      .setValue('input[type=text]', 'hiddenfounders')
      .setValue('input[type=password]', '%D9Xu64EB=2=%zhn3937arWWMR?kx?d4*8GGpP+M@fHrYKsV]s')
      .click('button[type=submit]')
      .waitForElementVisible('.application--wrap', 5000)
      // .useXpath()
      .click('a[title="Tests"]')
      .waitForElementVisible('.datatable', 5000)
      // .useCss()
      .click('.toolbar__side-icon')
      .pause(1000)
      .click('a[title="Create Test"]')
      .pause(1000)
      .click('.input-group__icon-cb')
      .waitForElementVisible('.dialog--active', 5000)
      .click('.btn--flat')
      .pause(1000)
      .click('#addqst')
      .pause(1000)
      .assert.elementCount('#addqst', 2)
      .end()
      
  }
}
