import $ from 'jquery'
import registerPlugin from './register-plugin'
import Bacon from 'baconjs'

class MainMenu {
  constructor(element) {
    this.$element = $(element)
    this.$items = this.$element.find('[data-item]')
    this.$links = this.$element.find('[data-link]')
    this.$panels = this.$element.find('[data-panel]')
    this.init()
  }

  init() {
    const currentlyOpen = Bacon.$.asEventStream.call(this.$items, 'mouseenter')
      .merge(Bacon.$.asEventStream.call(this.$items, 'mouseleave'))
      .throttle(100)
      .map((e) => ({
        type: e.type,
        $e: $(e.currentTarget),
      }))
      .scan(null, (open, event) => {
        if (event.type === 'mouseenter' || event.type === 'mouseover') {
          return event.$e
        }

        return null
      })

    currentlyOpen.onValue((open) => {
      this.open(open)
    })
  }

  open($itemOrNull) {
    let $item = $()

    if ($itemOrNull) {
      $item = this.$items.filter($itemOrNull)
      if (!$item) throw new Error('please provide either a link, a panel or null')
    }

    this.$items.each((i, e) => {
      const $e = $(e)
      const toggleClass = $e.is($item)

      $e.find('[data-panel]').toggleClass('is-open', toggleClass)
    })
  }
}

// Plugin definition
registerPlugin('mainMenu', MainMenu, (PluginWrapper) => {
  $('[data-menu="main"]').each(function () {
    const $menu = $(this)

    PluginWrapper.call($menu)
  })
})

// Copyright AXA Versicherungen AG 2016
