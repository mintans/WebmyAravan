const modes = {
  HSL:   ({h, s, l}) => one.color(`hsl(${h},${s}%,${l}%)`).hex(),
  HSLuv: ({h, s, l}) => hsluv.hsluvToHex([h, s, l]),
  HPLuv: ({h, s, l}) => hsluv.hpluvToHex([h, s, l])
};

const ColorWheel = Vue.extend({
  template: '#ColorWheel',
  props: ['mode'],
  data: () => ({
    modes,
    selectors: {
      mode: { value: 'HPLuv', list: modes }
    },
    sliders: {
      saturation: { min: 0, max: 100, step: 1, value: 100 },
      lightness:  { min: 0, max: 100, step: 1, value:  75 },
      density:    { min: 1, max:   5, step: 1, value:   3 }
    }
  }),
  computed: {
    items: x => 3 * Math.pow(2, x.sliders.density.value)
  },
  filters: {
    capitalize: x => x.charAt(0).toUpperCase() + x.slice(1)
  },
  components: {
    color: {
      template: '#ColorWheel-Color',
      props: ['mode', 'h', 's', 'l'],
      computed: {
        color: x => modes[x.mode](x),
        style: x => ({
          color: x.color,
          transform: `translate(-50%, -50%) rotate(${x.h}deg) translate(13em)`
        })
      },
      filters: {
        uppercase: x => x.toUpperCase()
      }
    },
    slider: {
      template: '#ColorWheel-Slider',
      props: ['cfg']
    }
  }
});

const router = new VueRouter({
  linkActiveClass: 'hl',
  routes: [
    { path: '/:mode', component: ColorWheel, props: true },
    { path: '*', redirect: 'HSL' }
  ]
});

const app = new Vue({
  template: '#App',
  router
});

document.body.appendChild(app.$mount().$el);